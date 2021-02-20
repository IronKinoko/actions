const axios = require('axios').default
const cookies = process.env.FLCOOKIES
const url = 'https://fastlink.ws/user'

async function signFL() {
  const res = await axios.post(
    url,
    {},
    {
      headers: {
        Cookies: cookies,
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
      },
    }
  )

  const msg = res.data.msg

  console.log(msg)
}

signFL()
