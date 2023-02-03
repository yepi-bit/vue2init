<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button @click="toDynamicRouter()">跳toDynamicRouter</el-button>
    <div v-for="(item, index) in list" :key="index">
      <div style="margin-top: 14px">
        <el-select v-model="item.value" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      list2: [
        {
          value: '选项1',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '北京烤鸭'
        }
      ],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, from, '--------beforeRouteEnter-about')
    next()   // next() 表示继续执行页面,要加上的,否则不显示
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, '--------beforeRouteUpdate-about')
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, from, '--------beforeRouteLeave-about')
    next()
  },
  methods: {
    toDynamicRouter() {
      this.$router.push({
        path: '/dynamicRouter/123456-0'
      })
    },
  },
  watch: {}
}
</script>
<style scoped>

</style>