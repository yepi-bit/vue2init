import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

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
    }
]
const routes2 = {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
}
// 动态路由前期工作
let commonUser = ['About', 'Danmu'];
let commonUserRoute = routes.filter(function (page) {
    return commonUser.includes(page.name)
})
console.log(commonUserRoute);
const router = new VueRouter({
    routes
})
// 动态路由
// addRoute会覆盖原有路由
// router.addRoute(routes2);

// 两个一起只作用一个
router.beforeEach((to, from, next) => {
    console.log(to.path, from, '------------------1')
    if (to.path === '/') {
        next()
    } else {
        next()  // 去掉路由失败
    }
})
// 可以做一些进度条完成，更改标题等
// router.afterEach((to, from, next) => {
//     console.log(to.path,'------------------2')
// })

export default router
