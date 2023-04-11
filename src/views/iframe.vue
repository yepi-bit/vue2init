<template>
  <div>
    <iframe src="https://www.bilibili.com/" width="100%" height="900" scrolling="auto" frameborder="0"
            class="trend-container2" id="iframe2"></iframe>
  </div>
</template>

<script>
export default {
  name: "iframe",
  data() {
    return {
    }
  },
  mounted() {
    // window.parent.postMessage({type:'say',value:1}, '*');
    window.addEventListener('message', messageEvent => {
      console.log(messageEvent)
      if(messageEvent.data.type == "change") {
        console.log(messageEvent,'messageEvent---iframe')
      }
    })
    this.bb()
  },
  methods: {
    bb() {
      console.log('w s bb')
    }
  }
}
</script>

<style scoped>

</style>