import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { AccountStateInterface } from './state'
import getters from './getters'
import mutations from './mutations'

const accountModule: Module<AccountStateInterface, StateInterface> = {
  namespaced: true,
  getters,
  mutations,
  state
}

export default accountModule
