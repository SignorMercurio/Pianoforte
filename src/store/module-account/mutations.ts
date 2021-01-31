import { MutationTree } from 'vuex'
import { AccountStateInterface } from './state'

const mutation: MutationTree<AccountStateInterface> = {
  login(state: AccountStateInterface, token: string) {
    state.token = token
    sessionStorage.setItem('token', token)
  },
  logout(state: AccountStateInterface) {
    state.token = ''
    sessionStorage.removeItem('token')
  }
}

export default mutation
