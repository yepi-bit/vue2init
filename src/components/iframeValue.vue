<template>
  <div>
    <el-button @click="sonClick">子页面处发</el-button>
  </div>
</template>

<script>
export default {
  mounted() {
    // 监听父页面向子页面的传参
    window.addEventListener('message', (e) => {
      console.log('父页面传输过来参数')
      console.log(e.data)
    });
  },
  methods: {
    // 子页面处发向父页面传参
    sonClick(){
      let data = {
        type:1,
        code:200,
        data:'子页面传输数据过来了'
      }
      window.parent.postMessage(data,'*');
    },

  }
}
</script>
