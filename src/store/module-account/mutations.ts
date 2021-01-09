import { MutationTree } from 'vuex'
import { AccountStateInterface } from './state'

const mutation: MutationTree<AccountStateInterface> = {
  setToken(state: AccountStateInterface, token: string) {
    state.token = token
  },
  clearToken(state: AccountStateInterface) {
    state.token = ''
  }
}

export default mutation
