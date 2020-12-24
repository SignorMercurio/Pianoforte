import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountStateInterface } from './state'

const getters: GetterTree<AccountStateInterface, StateInterface> = {
  getUser(state: AccountStateInterface) {
    return state.user
  }
}

export default getters
