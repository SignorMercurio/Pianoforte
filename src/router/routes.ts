import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('layouts/HeaderOnly.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { auth: true },
    children: [
      { path: 'projects', component: () => import('pages/Project/Index.vue') },
      {
        path: 'projects/detail',
        component: () => import('pages/Project/Detail.vue')
      },
      {
        path: 'assets',
        component: () => import('pages/Asset/Index.vue')
      },
      {
        path: 'assets/scan',
        name: 'AssetScan',
        component: () => import('pages/Asset/Scan.vue')
      },
      {
        path: 'domains',
        component: () => import('pages/Domain/Index.vue')
      },
      {
        path: 'domains/scan',
        name: 'DomainScan',
        component: () => import('pages/Domain/Scan.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
