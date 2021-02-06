import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { ProjectStateInterface } from './state'
import getters from './getters'
import mutations from './mutations'

const accountModule: Module<ProjectStateInterface, StateInterface> = {
  namespaced: true,
  getters,
  mutations,
  state,
}

export default accountModule
