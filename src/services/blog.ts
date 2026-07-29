import { BlogPost } from '../types'

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const RSS_URL = 'https://dev.to/feed/example'
  const PROXY = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`

  try {
    const response = await fetch(PROXY)
    const text = await response.text()

    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')
    const items = Array.from(xml.querySelectorAll('item'))

    return items.map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
      description: item.querySelector('description')?.textContent || ''
    }))
  } catch {
    return []
  }
}
