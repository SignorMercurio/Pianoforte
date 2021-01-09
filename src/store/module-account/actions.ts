import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountStateInterface } from './state'

const actions: ActionTree<AccountStateInterface, StateInterface> = {
  Login({ commit, state }, token: string) {
    commit('setToken', token)
    sessionStorage.setItem('state', JSON.stringify(state))
  },
  Logout({ commit }) {
    commit('clearToken')
    sessionStorage.removeItem('state')
  }
}

export default actions
