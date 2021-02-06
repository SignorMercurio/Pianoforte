import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { StateInterface } from '../store'
import routes from './routes'
import { Notify } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function (/* { store, ssrContext } */) {
  const createHistory =
    process.env.MODE === 'ssr'
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.auth)) {
      const token = sessionStorage.getItem('token')
      if (!token) {
        Notify.create({
          type: 'warning',
          message: 'Please login first',
        })
        setTimeout(() => {
          next({
            path: '/login',
            query: { redirect: to.fullPath },
          })
        }, 500)
      } else next()
    } else next()
  })

  return Router
})
