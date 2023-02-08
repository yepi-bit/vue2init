<template>
  <div>
    <el-button id="mes">{{ mes }}</el-button>
    <el-button @click="mesChange">异步更新</el-button>
  </div>
</template>

<script>
export default {
  name: "new23-02-08",
  data() {
    return {
      mes: 'hello'
    }
  },
  methods: {
    mesChange() {
      this.mes = 'newHello'
      let paper = document.getElementById('mes').innerText
      console.log('paper: ' + paper)
      this.$nextTick(() => {
        this.mes = 'newHello'
        let paper = document.getElementById('mes').innerText
        console.log('paper2: ' + paper)
      })
    },
  }
}
</script>

<style scoped>

</style>