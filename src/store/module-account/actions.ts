import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountStateInterface } from './state'
import { User } from './models'

const actions: ActionTree<AccountStateInterface, StateInterface> = {
  Login({ commit, state }, user: User) {
    commit('setUser', user)
    sessionStorage.setItem('store', JSON.stringify(state))
  },
  Logout({ commit }) {
    commit('clearUser')
    sessionStorage.removeItem('store')
  }
}

export default actions
