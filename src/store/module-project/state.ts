import { Project } from 'src/models/project'

export interface ProjectStateInterface {
  projects: Project[]
}

const state: ProjectStateInterface = {
  projects: []
}

export default state
