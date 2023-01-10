<template>
  <div class="about">
    <h1>This is an about page</h1>
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
    <div v-for="(item, index) in list2" :key="index">
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
  watch:{

  }
}
</script>
<style scoped>

</style>