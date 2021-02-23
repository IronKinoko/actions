import dotenv from 'dotenv'
if (process.env.GITHUB_ACTIONS !== 'true') {
  dotenv.config()
}

// signFL
import { signFL } from './scripts/signFL'
signFL()
