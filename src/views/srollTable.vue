<template>
  <div>
    <div style="width: 25vw;margin: auto" @mouseenter="mouseenter('enter')"
         @mouseleave="mouseleave('leave')">
      <el-table
          ref="table"
          :data="tableData"
          class="swiper-page-table"
          height="270px"
      >
        <el-table-column
            prop="date"
            label="分局"
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            prop="name"
            align="center"
            sortable
            :sort-method="sortMethod2"
            label="在管"
            width="100">
        </el-table-column>
        <el-table-column
            prop="name2"
            sortable
            :sort-method="sortMethod3"
            align="center"
            label="失控"
            width="100">
        </el-table-column>
        <el-table-column
            prop="core"
            sortable
            :sort-method="sortMethod"
            align="center"
            width="100"
            label="资金">
        </el-table-column>
      </el-table>
    </div>
    <el-divider></el-divider>
    <el-divider></el-divider>
    <div>
      <div style="width: 25vw;margin: auto">
        <div v-for="(item,index) in progressList" :key="index">
          <div>
            <span>{{ item.rank }}</span>
            <span>{{ item.name }}</span>
            <span>{{ item.type === 1 ? '管控' : '协查' }}</span>
          </div>
          <el-progress :text-inside="true" :stroke-width="14" :percentage="item.percentage"></el-progress>
        </div>
        <div>
          <transition name="el-zoom-in-top">
            <div v-show="show">
              <span>No.4</span>
              <span>任务4</span>
              <span>协查</span>
              <el-progress :text-inside="true" :stroke-width="14" :percentage="100"></el-progress>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      time2: null,
      show: false,
      progressList2:[],
      progressList: [
        {rank: 'No.1', name: '任务1', type: 1, percentage: 70},
        {rank: 'No.2', name: '任务2', type: 1, percentage: 60},
        {rank: 'No.3', name: '任务3', type: 2, percentage: 30},
      ],
      tableData: [
        {
          date: '111分局',
          name: 170,
          name2: 830,
          core: 100
        }, {
          date: '112分局',
          name: 100,
          name2: 180,
          core: 90
        }, {
          date: '113分局',
          name: 100,
          name2: 810,
          core: 170
        }, {
          date: '114分局',
          name: 1200,
          name2: 80,
          core: 1201
        }, {
          date: '115分局',
          name: 1100,
          name2: 1400,
          core: 170
        },
        {
          date: '116分局',
          name: '1005',
          name2: '801',
          core: 130
        },
        {
          date: '117分局',
          name: '130',
          name2: '180',
          core: 1301
        },
        {
          date: '118分局',
          name: '100',
          name2: '80',
          core: 1302
        },
        {
          date: '119分局',
          name: '100',
          name2: '80',
          core: 1201
        }, {
          date: '110分局',
          name: '100',
          name2: '80',
          core: 170
        },
      ]
    }
  },
  mounted() {
    this.refresh()
    this.proTime()
  },
  methods: {
    proTime() {
      if (this.show === false) {
        this.progressList2 = this.progressList
        this.time2 = setInterval(() => {
          this.progressList = this.progressList.slice(0, 2)
          this.show = true
          setTimeout(()=>{
            this.progressList = this.progressList2
            this.show = false
          },800)
        }, 1500)
      }
    },
    sortMethod(a, b) {
      return a.core - b.core;
    },
    sortMethod2(a, b) {
      return a.name - b.name;
    },
    sortMethod3(a, b) {
      return a.name2 - b.name2;
    },
    mouseenter(label) {
      if (label === 'enter') {
        clearInterval(this.time);
        this.time = null;
      }
    },
    mouseleave(label) {
      if (label === 'leave') {
        this.refresh()
      }
    },
    refresh() {
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.table
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      this.time = setInterval(() => {
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
    }
  },
  beforeDestroy() {
    clearInterval(this.time)
    clearInterval(this.time2)
  }
}
</script>
