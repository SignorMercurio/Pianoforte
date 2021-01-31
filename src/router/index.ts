import { route } from 'quasar/wrappers'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import routes from './routes'
import { Notify } from 'quasar'
import { StateInterface } from 'src/store'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route<Store<StateInterface>>(function({ store, Vue }) {
  Vue.use(VueRouter)

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
      const token = sessionStorage.getItem('token')
      if (!token) {
        Notify.create({
          type: 'warning',
          message: 'Please login first'
        })
        setTimeout(() => {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }, 500)
      } else next()
    } else next()
  })

  return Router
})
