import codyppRoute from './components/codypp'
import configRoute from './components/config'

export default [
  {
    path: '/',
    name: 'codypp',
    component: codyppRoute
  },
  {
    path: '/config',
    name: 'config',
    component: configRoute
  }
];
