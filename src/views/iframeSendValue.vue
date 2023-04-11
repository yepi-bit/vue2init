<template>
  <div>
    <iframe ref="sonIframe" src="./iframe.vue" width="100%" height="900" scrolling="auto" frameborder="0"></iframe>
    <el-button @click="sendMesFroIframe">传值</el-button>
  </div>
</template>

<script>
export default {
  mounted() {
    // document.domain = "localhost" // 跨域，第三方库基本都解决了跨域
    // let cc = document.getElementById("sonIframe").contentWindow.methods
    // console.log(cc)
    window.addEventListener('message', messageEvent => {
      if(messageEvent.data.type == "change") {
        console.log(messageEvent,'messageEvent2')
      }
    })
  },
  methods:{
    sendMesFroIframe() {
      var map_iframe = this.$refs.sonIframe
      map_iframe.onload = function() {
        map_iframe.contentWindow.bb();
      };
      // console.log(this.$refs.sonIframe.contentWindow.bb()) // 调用iframe里的方法
      // 向iframe传值
      const iframeWin = this.$refs.sonIframe.contentWindow
      iframeWin.postMessage(
          {
            type:'change',
            value: 'backSuccess',
            id: 'vue',
            success: true
          },
          '*' // 传递任何地方，可以指定位置如http://localhost:8080/
      );
    }
  }
}
</script>

<style scoped>

</style>