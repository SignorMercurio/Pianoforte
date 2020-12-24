import { MutationTree } from 'vuex'
import { AccountStateInterface } from './state'
import { User } from './models'

const mutation: MutationTree<AccountStateInterface> = {
  setUser(state: AccountStateInterface, user: User) {
    state.user = user
  },
  clearUser(state: AccountStateInterface) {
    state.user = {
      username: ''
    }
  }
}

export default mutation
