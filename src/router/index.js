import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import getToken, {setToken} from '../http/auth.js'

Vue.use(VueRouter)

let About, Danmu;
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/imgOpera',
        name: 'ImgOpera',
        component: () => import('../views/ImgOpera.vue')
    },
    {
        path: '/gridData',
        name: 'GridData',
        component: () => import('../views/GridData.vue')
    },
    {
        path: '/danmu',
        name: 'Danmu',
        component: () => import('../views/Danmu.vue')
    },
    {
        path: '/dynamicRouter/:id',
        name: 'dynamicRouter',
        component: () => import('../views/DynamicRouter.vue')
    },
    {
        path: '/new23-02-08',
        name: 'new23-02-08',
        component: () => import('../views/new23-02-08.vue')
    },
    {
        path: '/childrenAndParent',
        name: 'childrenAndParent',
        component: () => import('../views/ChildrenAndParent.vue')
    },
    {
        path: '/securityPlatform',
        name: 'securityPlatform',
        component: () => import('../views/securityPlatform.vue')
    },
    {
        path: '/clickVideo',
        name: 'clickVideo',
        component: () => import('../views/ClickVideo.vue')
    },
    {
        path: '/srollTable',
        name: 'srollTable',
        component: () => import('../views/srollTable.vue')
    },
    {
        path: '/iframe',
        name: 'iframe',
        component: () => import('../views/iframe.vue')
    },
    {
        path: '/fileSplict',
        name: 'fileSplict',
        component: () => import('../views/fileSplict.vue')
    },
    {
        path: '/map2d',
        name: 'map2d',
        component: () => import('../views/map2d.vue')
    }
]
const routes2 = [{
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
}]
// ????????????????????????
let commonUser = ['About', 'Danmu'];
let commonUserRoute = routes.filter(function (page) {
    return commonUser.includes(page.name)
})
console.log(commonUserRoute);
const router = new VueRouter({
    mode: 'history',  // ??????hash
    routes
})
// ????????????
// addRoute?????????????????????
// router.addRoute(routes2);

// ???????????????????????????
router.beforeEach((to, from, next) => {
    setToken('abcdefghijklmn')
    if (getToken) {
        console.log(getToken, 'getToken')
    }
    console.log(to.path, from, '------------------1')
    if (to.path === '/') {
        next()
    } else {
        next()  // ??????????????????
    }
})
// ????????????????????????????????????????????????
// router.afterEach((to, from, next) => {
//     console.log(to.path,'------------------2')
// })

export default router
