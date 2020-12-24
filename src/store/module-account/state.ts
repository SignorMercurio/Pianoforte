import { User } from './models'

export interface AccountStateInterface {
  user: User
}

const state: AccountStateInterface = {
  user: {
    username: ''
  }
}

export default state
