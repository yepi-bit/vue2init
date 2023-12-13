<template>
  <div>
    <div class="table-container">
      <el-table
          :data="tableData"
          style="width: 100%"
          border
      >
        <el-table-column
            prop="date"
            label="日期"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="180"
        ></el-table-column>
        <el-table-column
            prop="address"
            label="地址"
        ></el-table-column>
      </el-table>
    </div>
    <div class="bottomStyle" name="scrollName" style="overflow-y: scroll">
      <div class="title"><span>时间</span><span>姓名</span><span>地点</span></div>
      <li v-for="(item, index) in tableData2" :key="index">
        <div>
          <span>{{ item.date }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.address }}</span>
        </div>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ],
      tableData2: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ],
    };
  },
  mounted() {
    this.startScroll('scrollName')
  },
  methods: {
    startScroll(e) {
      let list = document.getElementsByName(e)
      for (let i = 0; i < list.length; i++) {
        const x = list[i]
        console.log(x)
        this.listScroll(x).then()
      }
    },
    listScroll(x) {
      do {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 100)
        })
        if (x.scrollHeight - x.scrollTop > x.clientHeight + 1) {
          console.log('123---2')
          x.scrollTop += 2
        } else {
          console.log('123---')
          x.scrollTop = 0
        }
      } while (true)
    }
  }
};
</script>

<style lang="less" scoped>
.table-container {
  max-height: 300px; /* 设置容器的最大高度，超出部分将隐藏并显示滚动条 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  position: relative; /* 设置为相对定位，为子元素的绝对定位做准备 */

  .el-table {
    height: 500px;
  }

  ::v-deep .el-table__body-wrapper {
    position: absolute; /* 设置为绝对定位，脱离文档流 */
    animation: scroll 10s linear infinite; /* 使用CSS动画让表格内容不停地滚动 */
  }
}


@keyframes scroll {
  from {
    top: 0;
  }
  to {
    top: -100%; /* 表格内容向上滚动一个表格高度的距离 */
  }
}

.bottomStyle {
  max-height: 240px; /* 设置容器的最大高度，超出部分将隐藏并显示滚动条 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  position: relative; /* 设置为相对定位，为子元素的绝对定位做准备 */

  .title {
    width: 100%;
    height: 40px;
    color: #00CBD6;
    line-height: 40px;

    span {
      font-size: 14px;
      display: inline-block;
      text-align: center;

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        width: 33%;
      }
    }
  }

  li {
    list-style: none;

    span {
      font-size: 12px;
      color: #00CBD6;
      height: 30px;
      line-height: 30px;
      text-align: center;
      display: inline-block;
      padding: 1.1111111111vh 0 0 0;

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        width: 33%;
      }
    }
  }
}
</style>
