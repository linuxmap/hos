/*
 * @Author: xiangxiao3
 * @项目路由
 * @Date: 2017-11-23 16:28:21
 * @Last Modified by: xiangxiao3
 * @Last Modified time: 2018-04-26 10:17:01
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import routes from '../router.config.json'
// import config from '../config/dolphin.config'

Vue.use(Router)

const Login = resolve => require(['index@/pages/login'], resolve)
const Home = resolve => require(['index@/pages/home'], resolve)

const createRoute = (routes) => {
  return routes.reduce((processedRoutes, currentRoute) => {
    processedRoutes.push(processRouteObj(currentRoute))
    return processedRoutes
  }, [])
}

/**
 * 路由统一转换方法
 * 面包削做了一次合并
 * @param {*} param0
 */
const processRouteObj = ({ menuCode, breadcrumb, children, component, ...args }) => {
  return Object.assign({
    meta: { menuCode },
    props: {
      breadcrumbObj: {
        content: breadcrumb || [],
        path: args.path,
        router: args.router || [],
        menuCode: menuCode
      }
    },
    component: () => import(`@/pages/${component}`),
    children: children ? createRoute(children) : []
  }, args)
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: createRoute(routes)
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || store.state.accessToken) {
    next()
  } else {
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  }
})

export default router
