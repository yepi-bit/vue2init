<template>
  <div>
    1
    <el-button @click="toSelfDynamicRouter()" type="primary">跳toSelfDynamicRouter</el-button>
  </div>
</template>

<script>
export default {
  name: "DynamicRouter",
  beforeRouteEnter(to, from, next) {
    console.log(to, from, '--------beforeRouteEnter-DynamicRouter')
    next()  // next() 表示继续执行页面,要加上的,否则不显示
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, '--------beforeRouteUpdate-DynamicRouter')
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, from, '--------beforeRouteLeave-DynamicRouter')
    next()
  },
  methods:{
    toSelfDynamicRouter() {
      this.$router.push({
        path: '/dynamicRouter/123456-1'
      })
    }
  }
}
</script>

<style scoped>

</style>