import { Experience } from '../types'

declare module './experiences.json' {
  const data: Experience[]
  export default data
}
