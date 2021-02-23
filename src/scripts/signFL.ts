import axios from 'axios'
import { sendBarkMsg } from '../notifactions/bark'

const url = 'https://fastlink.ws/user/checkin'

export async function signFL() {
  try {
    const cookie = process.env.FLCOOKIES
    const res = await axios({
      url,
      method: 'POST',
      headers: {
        cookie,
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
      },
    })

    const msg = res.data

    sendBarkMsg('FL自动签到', JSON.stringify(msg))
  } catch (error) {
    sendBarkMsg('FL自动签到', error.message)
  }
}
