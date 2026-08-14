import { getPayload } from 'payload'

import config from '../payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Seed harness ready — no collections defined yet.')
}

await run()
