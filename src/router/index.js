import Vue from 'vue'
import Router from 'vue-router'
import Login from "../views/Login"
import Layout from "../Layout"
import NProgress from "nprogress";
import store from "../store";
import 'nprogress/nprogress.css' // progress bar style


NProgress.configure({showSpinner: false}) // NProgress Configuration
Vue.use(Router);
//


export const constantRoutes = [
  {
    path: '/404',
    component: () => import(/* webpackChunkName: '404' */"../views/error-page/404"),
    hidden: true
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: '401' */'../views/error-page/401'),
    hidden: true
  },

  {
    path: '/',
    name: 'ToLogin',
    redirect: '/login',
    hidden: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true,
    meta: {title: 'Login'}
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    hidden: false,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: 'dashboardIndex' */'../views/dashboard/index'),
        meta: {title: 'Dashboard', icon: 'dashboard', affix: true}
      },
    ]
  },
  {
    path: '/project',
    name: 'Project',
    component: Layout,
    // redirect: '/project/index',
    hidden: false,
    alwaysShow: true,
    meta: {title: 'Project', icon: 'list'},
    children: [
      {
        path: 'management',
        component: () => import(/* webpackChunkName: 'projectList' */'../views/project/projectList'),
        meta: {title: 'Project Management', affix: true}
      },
    ]
  },
  {
    path: '/autoTest',
    name: 'AutoTest',
    component: Layout,
    //redirect: '/autoTest/index',
    hidden: false,
    meta: {title: 'Auto Test', icon: 'example'},
    children: [
      {
        path: 'management',
        component: () => import(/* webpackChunkName: 'codeManagement' */'../views/autoTest/codeManagement'),
        meta: {title: 'Code Management', affix: true}
      },
      {
        path: 'technicalNote',
        component: () => import(/* webpackChunkName: 'technicalNote' */'../views/autoTest/technicalNote'),
        meta: {title: 'Technical note', affix: true}
      },
    ]
  },
  {
    path: '/testExperience',
    name: 'TestExperience',
    component: Layout,
    //redirect: '/project/index',
    hidden: false,
    alwaysShow: true,
    meta: {title: 'Test Experience', icon: 'skill'},
    children: [
      {
        path: 'experienceSharing',
        component: () => import(/* webpackChunkName: 'experienceSharing' */'../views/testExperience/experienceSharing'),
        meta: {title: 'Experience sharing', affix: true}
      },
    ]
  },
  {
    path: '/after',
    name: 'After',
    component: Layout,
    //redirect: '/project/index',
    hidden: false,
    alwaysShow: true,
    meta: {title: 'After', icon: 'star'},
    children: [
      {
        path: 'ideas',
        component: () => import(/* webpackChunkName: 'ideas' */'../views/after/ideas'),
        meta: {title: 'Ideas', affix: true}
      },
    ]
  },
  {
    path: '/profile',
    component: Layout,
    alwaysShow: true,
    name: 'Profile',
    meta: {title: 'Profile', icon: 'lock'},
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: 'listProfile' */'../views/profile/list'),
        name: 'listProfile',
        meta: {title: 'Profile list', roles: ['admin', 'guest']}
      },
      {
        path: 'admin',
        component: () => import(/* webpackChunkName: 'profileAdmin' */'../views/profile/admin'),
        name: 'ProfileAdmin',
        meta: {title: 'Profile Admin', roles: ['admin']}
      },
      {
        path: 'normalUser',
        component: () => import(/* webpackChunkName: 'normalUser' */'../views/profile/normalUser'),
        name: 'NormalUser',
        meta: {title: 'Normal User', roles: ['guest']}
      },

    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

router.beforeEach(async (to, from, next) => {
  if (to.matched.length === 0) { //匹配前往的路由不存在
    from.name ? next({
      name: from.name
    }) : next('/404'); //判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  }

 console.log(to.meta.roles,store.getters.roles)

  if(to.path !== '/login'&&to.meta.roles&&to.meta.roles.filter(v =>store.getters.roles.includes(v))<=0)
  {


    next("/401")
  }
  // else {
  //   next(); //如果匹配到正确跳转
  // }
  // start progress bar
  NProgress.start()
  // set page title
  document.title = to.meta.title
  const token = store.getters.token
  //console.log("hellobefore-token", token)
  if (to.path !== '/login' && !token) {
    return next('/login')
  }

  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
