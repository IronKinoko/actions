import Axios from 'axios'
import { sendBarkMsg } from '../notifactions/bark'
const axios = Axios.create({
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
  },
})

const signUrl = 'https://fastlink.ws/user/checkin'
const loginUrl = 'https://fastlink.ws/auth/login'

async function login(account: string) {
  try {
    const [email, passwd] = account.split('\n')
    const res = await axios.post(loginUrl, { email, passwd })

    return (res.headers['set-cookie'] as string[]).join(';')
  } catch (error) {
    sendBarkMsg('FL自动签到', `Login Error: ${error.message}`)
  }
}

async function sign(cookie: string) {
  try {
    const res = await axios({
      url: signUrl,
      method: 'POST',
      headers: { cookie },
    })

    const msg = res.data

    sendBarkMsg('FL自动签到', JSON.stringify(msg))
  } catch (error) {
    sendBarkMsg('FL自动签到', error.message)
  }
}

export async function signFL() {
  const account = process.env.FL
  if (!account) return console.log('no FL account')
  const cookie = await login(account)

  if (!cookie) return
  await sign(cookie)
}
