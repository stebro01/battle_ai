
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'IndexPage', component: () => import('pages/IndexPage.vue') },
      { path: 'battle', name: 'BattlePage', component: () => import('pages/BattlePage.vue') },
      { path: 'finished', name: 'FinishedPage', component: () => import('pages/FinishedPage.vue') }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
