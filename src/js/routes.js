import codyppRoute from './components/codypp-ide/codypp'
import configRoute from './components/codypp-config/config'

export default [

  {
    path: '/',
    name: 'codypp',
    component: codyppRoute,
    meta: { title: 'Cody++' }
  },
  {
    path: '/config',
    name: 'config',
    component: configRoute,
    meta: { title: 'Cody++ Configuration' }
  },
  {
    path: '*',
    redirect: '/'
  }
];
