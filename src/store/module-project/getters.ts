import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ProjectStateInterface } from './state'

const getters: GetterTree<ProjectStateInterface, StateInterface> = {
  getProjects(state: ProjectStateInterface) {
    return state.projects
  },
}

export default getters
