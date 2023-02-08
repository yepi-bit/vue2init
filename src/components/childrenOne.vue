<template>
  <div>
    <button @click="parentClick">我是childrenOne点击访问父组件</button>
  </div>
</template>
<script>

export default {
  data() {
    return {
      msg: "childrenOne"
    }
  },
  methods: {
    parentClick() {
      this.$parent.funA("childrenOne传给父")
      console.log(this.$parent.total);
    }
  }
}
</script>