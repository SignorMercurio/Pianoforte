import { MutationTree } from 'vuex'
import { ProjectStateInterface } from './state'
import { Project } from 'src/models/project'

const mutation: MutationTree<ProjectStateInterface> = {
  setProjects(state: ProjectStateInterface, projects: Project[]) {
    state.projects = projects
  },
  clearProjects(state: ProjectStateInterface) {
    state.projects = []
  },
}

export default mutation
