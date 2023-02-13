<template>
  <div>
    <el-steps :active="milepostActive" :align-center="true">
      <el-step v-for="(value, key) in milepost"
               :class="milepostActive === key + 1 ? stepActive: '' "
               :title="value.title"
               :description="value.description">
      </el-step>
    </el-steps>
    <div>
      <el-row>
        <el-col :span="7">
          <div id="funnel" ref="funnel"></div>
        </el-col>
        <el-col :span="7">
          <div id="raDar" ref="raDar"></div>
        </el-col>
        <el-col :span="7">
          <div id="bar" ref="bar"></div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col>
          <div
              style="width: 150px;height: 150px;border-radius: 50%;background: cornflowerblue;">
            <div style="line-height: 150px;text-align: center">
              <span>打卡</span>
              <span>{{ nowDate }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: "securityPlatform",
  data() {
    return {
      funnel: null,
      raDar: null,
      bar: null,
      nowDate: '',
      // 数组对象
      milepost: [
        {title: '项目策划', description: '2019.1.1'},
        {title: '立项', description: '2019.3.1'},
        {title: '需求', description: '2019.5.1'},
        {title: '开发', description: '2019.7.1'},
        {title: '测试', description: '2019.9.1'},
        {title: '发布', description: '2019.11.1'},
        {title: '结项', description: '2019.12.31'},
      ],
      // 默认步骤数
      milepostActive: 5,
      // 动态添加类名
      stepActive: 'stepActive'
    }
  },
  computed: {
    funnelOption() {
      return {
        title: {
          text: '漏斗'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
        },
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: [
              {value: 60, name: 'Visit'},
              {value: 90, name: 'Inquiry'},
              {value: 20, name: 'Order'},
              {value: 180, name: 'Click'},
              {value: 100, name: 'Show'}
            ]
          }
        ]
      }
    },
    raDarOption() {
      return {
        title: {
          text: '雷达'
        },
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            {name: 'Sales', min: 0, max: 6500},
            {name: 'Administration', max: 16000},
            {name: 'Information Technology', max: 30000, color: 'red'},
            {name: 'Customer Support', max: 38000},
            {name: 'Development', max: 52000},
            {name: 'Marketing', max: 25000}
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      }
    },
    barOption() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Expenses', 'Income']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        series: [
          {
            name: 'Income',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 341, 374, 390, 450, 420]
          },
          {
            name: 'Expenses',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'left'
            },
            emphasis: {
              focus: 'series'
            },
            data: [-120, -132, -101, -134, -190, -230, -210]
          }
        ]
      }
    }
  },
  mounted() {
    this.funnel = this.$echarts.init(this.$refs.funnel);
    this.funnel.setOption(this.funnelOption)
    this.raDar = this.$echarts.init(this.$refs.raDar);
    this.raDar.setOption(this.raDarOption)
    this.bar = this.$echarts.init(this.$refs.bar);
    this.bar.setOption(this.barOption)
    window.onresize = () => {
      this.funnel.resize();
      this.raDar.resize();
      this.bar.resize();
    }
    setInterval(() => {
      this.nowDate = this.timestampToTime(new Date().getTime())
    }, 1000)
  },
  destroyed() {
    this.nowDate = null
  },
  methods: {
    // 时间戳：1637244864707
    /* 时间戳转换为时间 */
    timestampToTime(timestamp) {
      timestamp = timestamp ? timestamp : null;
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }

  }
}
</script>

<style scoped>
::v-deep .el-step__description {
  color: cornflowerblue;
  margin-top: -90px;
}

::v-deep .el-step.is-center .el-step__description {
  /*padding-right: 40%;*/
  /*padding-bottom: 30%;*/
}

::v-deep .el-step.is-horizontal.stepActive .el-step__head.is-finish .el-step__line .el-step__line-inner {
  width: 50% !important;
  border-width: 2px !important;
}

::v-deep .el-step.is-horizontal.stepActive .el-step__head.is-finish .el-step__icon.is-text {
  background: #409eff;
  color: #fff;
}

#funnel, #raDar, #bar {
  width: 100%;
  height: 50vh;
  margin-top: 50px;
}
</style>