import { Project } from '../types'
import githubClient from '../utils/httpClient'
import data from '../data/const.json'
import { useProjectsStore } from '../store/useProjectsStore'

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  stargazers_count: number
}

type GitHubRelease = {
  tag_name: string
  html_url: string
  published_at: string
}

export const getProjects = async (): Promise<Project[]> => {
  const store = useProjectsStore.getState()

  // Return cached if fresh
  if (!store.shouldRefetch() && store.projects.length > 0) {
    return store.projects
  }
  const repos = await githubClient.get(`users/${data['github-profile']}/repos`, {
    searchParams: { sort: 'updated', per_page: 100 }
  }).json<GitHubRepo[]>()

  const projects = await Promise.all(
    repos
      .filter(repo => !repo.name.startsWith('.'))
      .map(async repo => {
        let latestRelease
        try {
          const release = await githubClient.get(`repos/A-N-O-D-E-R/${repo.name}/releases/latest`).json<GitHubRelease>()
          latestRelease = {
            version: release.tag_name,
            url: release.html_url,
            publishedAt: release.published_at
          }
        } catch {
          // No release
        }

        return {
          id: repo.id.toString(),
          title: repo.name,
          description: repo.description || 'No description',
          tech: repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
          github: repo.html_url,
          demo: repo.homepage || undefined,
          stars: repo.stargazers_count,
          latestRelease
        }
      })
  )

  // Cache results
  store.setProjects(projects)

  return projects
}
