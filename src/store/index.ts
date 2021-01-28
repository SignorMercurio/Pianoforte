import { store } from 'quasar/wrappers'
import Vuex from 'vuex'

import account from './module-account'
import { AccountStateInterface } from './module-account/state'
import project from './module-project'
import { ProjectStateInterface } from './module-project/state'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  account: AccountStateInterface
  project: ProjectStateInterface
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  // example: unknown
}

export default store(function({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      account,
      project
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  })

  return Store
})
