import ky, { type AfterResponseHook } from 'ky'

export const githubApiUrl = 'https://api.github.com'

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export const rateLimitAfterResponseHook: AfterResponseHook = async ({ response }) => {
  if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
    const resetTime = response.headers.get('X-RateLimit-Reset')
    if (resetTime) {
      const waitTime = parseInt(resetTime) * 1000 - Date.now()
      console.warn(`GitHub rate limit hit, waiting ${waitTime}ms`)
      await delay(Math.min(waitTime, 60000))
    }
  }
  return response
}

const githubClient = ky.create({
  prefix: githubApiUrl,
  timeout: 10000,
  headers: {
    accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  },
  hooks: {
    afterResponse: [rateLimitAfterResponseHook]
  }
})

export const nullIf404AfterResponseHook: AfterResponseHook = ({ response }) => {
  if (response.status === 404) {
    return new Response(null, { status: 200 })
  }
  return response
}

export default githubClient
