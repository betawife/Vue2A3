import { createRouter , createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('../views/HomePage.vue'),
    redirect: '/energy-carbon-charts/carbon-emission',
    children: [
      {
        path: 'energy-carbon-charts',
        name: 'EnergyCarbonCharts',
        component: () => import('../components/EnergyAndCarbonCharts.vue'),
        redirect: '/energy-carbon-charts/carbon-emission',
        children: [
          {
            path: 'carbon-emission',
            name: 'CarbonEmissionCharts',
            component: () => import('../components/CarbonEmissionCharts.vue')
          },
          {
            path: 'energy-consumption',
            name: 'EnergyConsumptionCharts',
            component: () => import('../components/EnergyConsumptionCharts.vue')
          }
        ]
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/DashboardComponent.vue')
      },
      {
        path: 'carbon-account',
        name: 'CarbonAccount',
        component: () => import('../components/CarbonAccount.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../components/SettingsComponent.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL||'/'),
  routes
})

export default router