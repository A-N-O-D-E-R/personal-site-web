export type Experience = {
  id: string
  type: 'work' | 'study'
  title: string
  company: string
  location: string
  coords: [number, number, number]
  lat?: number
  lon?: number
  period: string
  description: string
  tech?: string[]
  tasks?: string[]
  highlights?: string[]
  resources?: Array<{
    title: string
    url: string
  }>
}

export type Project = {
  id: string
  title: string
  description: string
  tech: string[]
  github?: string
  demo?: string
  image?: string
  stars?: number
  latestRelease?: {
    version: string
    url: string
    publishedAt: string
  }
}

export type BlogPost = {
  title: string
  link: string
  pubDate: string
  description: string
}
