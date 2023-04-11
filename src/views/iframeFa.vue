<template>
  <div>
<!--  来源其他项目  -->
    <iframe ref="fIframe" class="iframeClass" src="xxx" frameborder="0"></iframe>
    <el-button @click="fClick">父页面传参</el-button>
  </div>
</template>

<script>
export default {
  mounted() {
    // 监听子页面想父页面的传参
    window.addEventListener('message',function(event){
      //此处执行事件
      console.log('监听到子页面的传参')
      console.log(event.data)
    })
  },
  methods: {
    // 父页面处发向子页面传参
    fClick(){
      let data = {
        type:2,
        code:200,
        data:'父页面面传输数据过来了'
      }
      this.$refs.fIframe.contentWindow.postMessage(data,'*')
    },
  }
}
</script>

<style >
.iframeClass{
  width:100%;height:100vh;
}
</style>