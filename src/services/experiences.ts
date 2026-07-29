import { Experience } from '../types'
import data from '../data/experiences.json'

export const getExperiences = async (): Promise<Experience[]> => {
  // Direct import, swap for API when needed using https://rapidapi.com/saleleadsdotai-saleleadsdotai-default/api/fresh-linkedin-scraper-api/playground/apiendpoint_a944725a-b86d-4ade-8711-ef1ae0712933
  return data as Experience[]
}
