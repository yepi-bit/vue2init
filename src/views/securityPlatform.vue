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
        <el-col :span="7">
          <div
              style="width: 150px;height: 150px;border-radius: 50%;background: cornflowerblue;">
            <div style="line-height: 150px;text-align: center">
              <span>打卡</span>
              <span>{{ nowDate }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div id="barCj" ref="barCj"></div>
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
      barCj: null,
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
      CjData: [
        {value: 110, name: "语文成绩"},
        {value: 5, name: "数学"},
        {value: 140.5, name: "英语成绩"},
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
    },
    barCjOption() {
      return {
        title: {
          zlevel: 2, // 控制圆环图中间的字的层级
          text: "我是小明的成绩单",
          top: "47%", // 控制位置
          left: "32%", // 控制位置
          textAlign: "center", // 让文字居中
        },
        tooltip: {
          trigger: "item", // 触发机制，鼠标悬浮圆环项上
          show: true, // 控制鼠标悬浮是否显示数据
        },
        legend: {
          orient: "vertical", // 控制水平排列
          top: "36%", // 调整位置
          right: "6%", // 距离右侧位置
          icon: "circle", // 修改小图标为圆形
          itemHeight: 12, // 修改圆形小图标的大小
          textStyle: {
            // 文字的样式
            fontSize: 24, // 可控制每个legend项的间距
            color: "#828282",
            rich: {
              // 通过富文本rich给每个项设置样式，下面的oneone、twotwo、threethree可以理解为"每一列"的样式
              oneone: {
                // 设置文字、数学、英语这一列的样式
                width: 50,
                color: "#000000",
                fontSize: 12,
                fontWeight: "bolder",
              },
              twotwo: {
                // 设置10分、20分、30分这一列的样式
                width: 35,
                color: "#333",
                fontSize: 12,
              },
              threethree: {
                // 设置百分比这一列的样式
                width: 20,
                color: "#E0E0E0",
                fontSize: 12,
              },
            },
          },
          formatter: (name) => {
            // formatter格式化函数动态呈现数据
            var total = 0; // 用于计算总数
            var target; // 遍历拿到数据
            for (var i = 0; i < this.CjData.length; i++) {
              total += this.CjData[i].value;
              if (this.CjData[i].name == name) {
                target = this.CjData[i].value;
              }
            }
            var v = ((target / total) * 100).toFixed(2);
            return `{oneone|${name}}  {twotwo|${target}分}   {threethree|${v}%}`;
            //     富文本第一列样式应用    富文本第二列样式应用      富文本第三列样式应用
          },
        },
        color: ["#baf", "#bfa", "#cde"], // 控制圆环图的颜色
        series: [
          {
            name: "成绩单",
            type: "pie", // 类型为饼图
            radius: ["30%", "50%"], // 圆环分为内径和外径，就是两个半径不一样的饼图可组成一个圆环图，radius数组中的两项分别为内径和外径（相对画布的百分比）
            center: ["32%", "50%"], // 调整圆环图位置
            data: this.CjData, // 饼图的数据，一般是发请求获取的
            avoidLabelOverlap: true, // 防止牵引线堆叠挤在一块
            label: {
              normal: {
                show: true,
                position: "outside", // 另有参数inside，可以让数据在圆环上
                formatter: "{d}%", //模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                textStyle: {
                  // 牵引线上的文字的样式
                  align: "right",
                  baseline: "middle",
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                  fontWeight: "bolder",
                  color: "#333",
                },
              },
            },
            labelLine: {
              show: true, // 是否显示延展线
              length: 10, // 延展线条的长度
            },
          },
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
    this.barCj = this.$echarts.init(this.$refs.barCj);
    this.barCj.setOption(this.barCjOption)
    window.onresize = () => {
      this.funnel.resize();
      this.raDar.resize();
      this.bar.resize();
      this.barCj.resize()
    }
    setInterval(() => {
      this.nowDate = this.timestampToTime(new Date().getTime())
    }, 1000)
  },
  destroyed() {
    clearInterval(this.nowDate)
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
#barCj {
  width: 100%;
  height: 50vh;
  margin-top: 50px;
}
</style>
