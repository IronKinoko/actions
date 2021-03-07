import dotenv from 'dotenv'
if (process.env.GITHUB_ACTIONS !== 'true') {
  dotenv.config()
}

// signFL
import { signFL } from './scripts/signFL'

// e20210225cooking
import { main as e20210225cooking } from './scripts/e20200225cooking'

async function run() {
  await signFL()

  await e20210225cooking()
}

run()
