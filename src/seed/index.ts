import { mkdtemp, rm, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../payload.config'
import { seedDogs } from './data/dogs'

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

  try {
    let created = 0
    let skipped = 0

    for (const dog of seedDogs) {
      const existing = await payload.find({
        collection: 'dogs',
        where: { slug: { equals: dog.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        skipped += 1
        continue
      }

      const imagePath = path.join(tmpDir, `${dog.slug}.png`)
      await writeFile(
        imagePath,
        await sharp({
          create: {
            width: 800,
            height: 600,
            channels: 3,
            background: dog.photoColor,
          },
        })
          .png()
          .toBuffer(),
      )

      const media = await payload.create({
        collection: 'media',
        data: { alt: `Photo of ${dog.name}` },
        filePath: imagePath,
      })

      await payload.create({
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

      created += 1
    }

    payload.logger.info(`Seeded Dogs: ${created} created, ${skipped} already existed.`)
  } finally {
    await rm(tmpDir, { recursive: true, force: true })
  }
}

await run()
