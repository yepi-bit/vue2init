<template>
  <div>
    <button style="padding: 20px" @click="toLogin">模拟异步登录</button>
    <h3>{{ dataList }}</h3>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import store from '../store/index.js';

export default {
  name: "storeAsync",
  data() {
    return {
      username: '我是',
      dataList: null
    }
  },
  async beforeRouteEnter(to, from, next) {
    const isLogin = await store.dispatch('preLogin');
    const needLogin = to.matched.some(match => match.meta.needLogin);
    if (needLogin) {
      if (isLogin === 1) {
        next()
      } else {
        next('/areaMap')
      }
    } else {
      if (isLogin === 1 && to.name === 'storeAsync') {
        next('/storeAsync')
      } else {
        next()
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    toLogin() {
      this.login(this.username).then(res => {
        this.dataList = res
      }, error => {
        console.log(error)
      })
    },
  }
}
</script>

<style scoped>

</style>