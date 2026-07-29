import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project } from '../types'

type ProjectsStore = {
  projects: Project[]
  lastFetch: number | null
  setProjects: (projects: Project[]) => void
  shouldRefetch: () => boolean
}

const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      projects: [],
      lastFetch: null,
      setProjects: (projects: Project[]) =>
        set({ projects, lastFetch: Date.now() }),
      shouldRefetch: () => {
        const { lastFetch } = get()
        if (!lastFetch) return true
        return Date.now() - lastFetch > CACHE_DURATION
      }
    }),
    {
      name: 'projects-storage'
    }
  )
)
