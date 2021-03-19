import axios from 'axios'

interface BarkMessageParams {
  title: string
  content?: string
}

function sendBarkMsg(params: BarkMessageParams): void
function sendBarkMsg(title: string, content?: string): void
function sendBarkMsg(
  params: string | BarkMessageParams,
  content?: string
): void {
  let url = process.env.BARK_URL
  if (!url) return console.log('no bark url')
  url = url.replace(/\/$/, '')

  let opts: BarkMessageParams = { title: '' }

  if (typeof params === 'string') {
    opts.title = params
    opts.content = content
  } else {
    opts = params
  }

  opts.title = encodeURIComponent(opts.title)
  opts.content = encodeURIComponent(opts.content || '')

  url = [url, opts.title, opts.content].filter(Boolean).join('/')
  axios.get(url)
}

export { sendBarkMsg }
