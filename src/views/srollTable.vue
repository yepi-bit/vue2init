<template>
  <el-table
      ref="table"
      :data="tableData"
      class="swiper-page-table"
      height="340px"
  >
    <el-table-column
        prop="date"
        label="日期"
        width="180">
    </el-table-column>
    <el-table-column
        prop="name"
        label="姓名"
        width="180">
    </el-table-column>
    <el-table-column
        prop="core"
        sortable
        :sort-method="sortMethod"
        label="资金">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        core: 100
      }, {
        date: '2016-05-04',
        name: '王小虎',
        core: 90
      }, {
        date: '2016-05-01',
        name: '王小虎',
        core: 170
      }, {
        date: '2016-05-03',
        name: '王小虎',
        core: 1201
      }, {
        date: '2016-05-01',
        name: '王小虎',
        core: 170
      },
        {
          date: '2016-05-01',
          name: '王小虎',
          core: 130
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          core: 1301
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          core: 1302
        }
      ]
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    sortMethod(a, b) {
      return a.core - b.core;
    },
    refresh() {
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.table
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      setInterval(() => {
        // 元素自增距离顶部1像素
        divData.scrollTop += 1
        // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
        if (divData.clientHeight + divData.scrollTop + 1 > divData.scrollHeight) {
          // 重置table距离顶部距离
          divData.scrollTop = 0

          // 滚动到最底部后执行刷新表格的方法
          // this.tableData.concat(this.tableData)
        }
      }, 30)
      // const that = this
      // window.onresize = () => {
      //   return (() => {
      //     window.screenHeight = document.body.clientHeight
      //     that.clientHeight = window.screenHeight
      //   })()
      // }
    }
  }
}
</script>
