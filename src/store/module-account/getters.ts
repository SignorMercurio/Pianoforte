import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountStateInterface } from './state'

const getters: GetterTree<AccountStateInterface, StateInterface> = {
  getToken(state: AccountStateInterface) {
    return state.token
  },
}

export default getters
