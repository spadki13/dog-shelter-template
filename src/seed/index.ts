import { mkdtemp, rm, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../payload.config'
import { seedDogs } from './data/dogs'
import { seedApplications } from './data/adoptionApplications'
import { seedProducts } from './data/products'
import { seedDonations } from './data/donations'

const createPlaceholderImage = async (
  tmpDir: string,
  slug: string,
  color: string,
  alt: string,
  payload: Awaited<ReturnType<typeof getPayload>>,
) => {
  const imagePath = path.join(tmpDir, `${slug}.png`)
  await writeFile(
    imagePath,
    await sharp({
      create: { width: 800, height: 600, channels: 3, background: color },
    })
      .png()
      .toBuffer(),
  )

  return payload.create({
    collection: 'media',
    data: { alt },
    filePath: imagePath,
  })
}

const run = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      shelterName: 'Riverbend Dog Shelter',
      primaryColor: '#2563eb',
      contactEmail: 'hello@riverbenddogs.example',
      contactPhone: '(555) 123-4567',
      address: '123 Shelter Lane, Riverbend, ST 00000',
      features: {
        enableDonations: true,
        enableMerch: true,
        enableAdoptionApplications: true,
      },
    },
  })
  payload.logger.info('Seeded SiteSettings.')

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'dog-shelter-seed-'))
  const dogIdBySlug = new Map<string, number>()

  try {
    let dogsCreated = 0
    let dogsSkipped = 0

    for (const dog of seedDogs) {
      const existing = await payload.find({
        collection: 'dogs',
        where: { slug: { equals: dog.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        dogIdBySlug.set(dog.slug, existing.docs[0].id)
        dogsSkipped += 1
        continue
      }

      const media = await createPlaceholderImage(
        tmpDir,
        dog.slug,
        dog.photoColor,
        `Photo of ${dog.name}`,
        payload,
      )

      const createdDog = await payload.create({
        collection: 'dogs',
        data: {
          name: dog.name,
          slug: dog.slug,
          status: dog.status,
          breed: dog.breed,
          age: dog.age,
          sex: dog.sex,
          size: dog.size,
          mainPhoto: media.id,
        },
      })

      dogIdBySlug.set(dog.slug, createdDog.id)
      dogsCreated += 1
    }

    payload.logger.info(`Seeded Dogs: ${dogsCreated} created, ${dogsSkipped} already existed.`)

    let productsCreated = 0
    let productsSkipped = 0

    for (const product of seedProducts) {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: product.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        productsSkipped += 1
        continue
      }

      const media = await createPlaceholderImage(
        tmpDir,
        product.slug,
        product.photoColor,
        product.name,
        payload,
      )

      await payload.create({
        collection: 'products',
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceInCents: product.priceInCents,
          inventory: product.inventory,
          image: media.id,
          active: true,
        },
      })

      productsCreated += 1
    }

    payload.logger.info(
      `Seeded Products: ${productsCreated} created, ${productsSkipped} already existed.`,
    )
  } finally {
    await rm(tmpDir, { recursive: true, force: true })
  }

  let applicationsCreated = 0
  let applicationsSkipped = 0

  for (const application of seedApplications) {
    const dogId = dogIdBySlug.get(application.dogSlug)
    if (!dogId) continue

    const existing = await payload.find({
      collection: 'adoption-applications',
      where: {
        and: [
          { dog: { equals: dogId } },
          { applicantEmail: { equals: application.applicantEmail } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      applicationsSkipped += 1
      continue
    }

    // Always create at `submitted` first (fires the submission email), then
    // transition to the target status so the status-change email hook exercises
    // the same path a real review would.
    const createdApplication = await payload.create({
      collection: 'adoption-applications',
      data: {
        dog: dogId,
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
        applicantPhone: application.applicantPhone,
        message: application.message,
        status: 'submitted',
      },
    })

    if (application.targetStatus !== 'submitted') {
      await payload.update({
        collection: 'adoption-applications',
        id: createdApplication.id,
        data: { status: application.targetStatus },
      })
    }

    applicationsCreated += 1
  }

  payload.logger.info(
    `Seeded AdoptionApplications: ${applicationsCreated} created, ${applicationsSkipped} already existed.`,
  )

  let donationsCreated = 0
  let donationsSkipped = 0

  for (const donation of seedDonations) {
    const existing = await payload.find({
      collection: 'donations',
      where: { donorEmail: { equals: donation.donorEmail } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      donationsSkipped += 1
      continue
    }

    await payload.create({
      collection: 'donations',
      data: {
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amountInCents: donation.amountInCents,
        frequency: donation.frequency,
        status: donation.status,
      },
    })

    donationsCreated += 1
  }

  payload.logger.info(
    `Seeded Donations: ${donationsCreated} created, ${donationsSkipped} already existed.`,
  )
}

await run()
