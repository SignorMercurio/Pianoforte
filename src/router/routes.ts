import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/HeaderOnly.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { auth: true },
    children: [
      { path: '', redirect: 'projects' },
      { path: 'projects', component: () => import('pages/Project/Index.vue') },
      {
        path: 'projects/detail',
        component: () => import('pages/Project/Detail.vue'),
      },
      {
        path: 'assets',
        component: () => import('pages/Asset/Index.vue'),
      },
      {
        path: 'assets/scan',
        name: 'AssetsScan',
        component: () => import('pages/Asset/Scan.vue'),
      },
      {
        path: 'domains',
        component: () => import('pages/Domain/Index.vue'),
      },
      {
        path: 'domains/scan',
        name: 'DomainsScan',
        component: () => import('pages/Domain/Scan.vue'),
      },
      {
        path: 'ports',
        component: () => import('pages/Port/Index.vue'),
      },
      {
        path: 'ports/scan',
        name: 'PortsScan',
        component: () => import('pages/Port/Scan.vue'),
      },
      {
        path: 'dirs',
        component: () => import('pages/Dir/Index.vue'),
      },
      {
        path: 'dirs/scan',
        name: 'DirectoriesScan',
        component: () => import('pages/Dir/Scan.vue'),
      },
      {
        path: 'fingers',
        component: () => import('pages/Finger/Index.vue'),
      },
      {
        path: 'fingers/scan',
        name: 'FingerprintsScan',
        component: () => import('pages/Finger/Scan.vue'),
      },
      {
        path: 'endpoints',
        component: () => import('pages/Endpoint/Index.vue'),
      },
      {
        path: 'endpoints/scan',
        name: 'EndpointsScan',
        component: () => import('pages/Endpoint/Scan.vue'),
      },
      {
        path: 'vulns',
        component: () => import('pages/Vuln/Index.vue'),
      },
      {
        path: 'vulns/scan',
        name: 'VulnerabilitiesScan',
        component: () => import('pages/Vuln/Scan.vue'),
      },
      {
        path: 'settings',
        component: () => import('pages/Settings.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
