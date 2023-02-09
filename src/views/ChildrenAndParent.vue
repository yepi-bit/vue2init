<template>
  <div>
    <childrenOne ref="childrenOne"></childrenOne>
    <childrenTwo></childrenTwo>
    <el-button @click="clickChild1">$refs方式获取子组件值</el-button>
    <el-button @click="clickChild2">$children方式获取子组件值</el-button>
    <p>需要注意 $children 并不保证顺序，也不是响应式的。</p>
  </div>
</template>
<script>
import childrenOne from "@/components/childrenOne";
import childrenTwo from "@/components/childrenTwo";

export default {
  components: {
    childrenOne,
    childrenTwo
  },
  data() {
    return {
      total: 108
    }
  },
  methods: {
    funA(e) {
      console.log("index", e)
    },
    clickChild1() {
      console.log(this.$refs.childrenOne.msg);
    },
    clickChild2() {
      console.log(this.$children)
      console.log(this.$children[0].msg)
      console.log(this.$children[1].msg)
    }
  }
}
</script>