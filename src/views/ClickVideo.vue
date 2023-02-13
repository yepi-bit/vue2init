<template>
  <div class="timeSwiper">
    <div class="time-box">
      <div class="time-title">时间</div>
      <div class="tool-left" @click="reduceYear(nowYear)">
        <span><</span>
        <div class="icontime">{{ nowYear }}</div>
      </div>
      <div id="time-lineST">
        <div
            class="keyItemBoxST"
            v-for="(item, __index) of timeKeyWordlist"
            :key="__index"
            :style="getStyle(__index)"
            @click="changeVideoTime(__index)"
        >
          <div v-if="__index === theindex" class="keyitemtitle">
            {{ item.image_time.substr(0, 10) }}
          </div>
        </div>
        <div id="changiconST" :style="getIconX()">
          <div id="VerticalST"></div>
          <div id="triangleST"></div>
        </div>
      </div>
      <div class="tool-right" @click="addYear(nextYear)">
        <span>></span>
        <div class="icontime">{{ nextYear }}</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      keyX: [], //关键词时间坐标
      timeKeyWordlist: [],
      timeKeyWordlistALL: [
        {
          image_time: "2021-11-09",
        },
        {
          image_time: "2022-01-15",
        },
        {
          image_time: "2022-08-12",
        },
        {
          image_time: "2022-11-05",
        },
        {
          image_time: "2022-11-23",
        },
        {
          image_time: "2022-12-21",
        },
        {
          image_time: "2023-07-05",
        },
        {
          image_time: "2023-09-05",
        },
        {
          image_time: "2023-10-05",
        },
        {
          image_time: "2023-12-05",
        },
      ],
      theindex: 0,
      nextYear: null,
      nowYear: null,
      timeAll: 0,
    };
  },
  watch: {
    timeleft() {
      this.getIconX();
    },
    theindex() {
      console.log(this.theindex, "theindex");
    },
  },
  methods: {
    getlist() {
      this.timeKeyWordlistALL = this.timeKeyWordlistALL.sort(function (a, b) {
        return a.image_time < b.image_time ? 1 : -1;
      });
      this.timeKeyWordlist = [];
      this.timeKeyWordlist = this.timeKeyWordlistALL.filter(
          (val) => val.image_time.indexOf(this.nowYear) > -1
      );
      this.$nextTick(() => {
        this.computeX();
      });
    },
    //利用translateX实现X坐标的移动
    getStyle(__index) {
      if (this.keyX && this.keyX.length > 0 && this.keyX[__index]) {
        let value = this.keyX[__index].transform;
        return "transform: translateX(" + value + "px)";
      } else {
        return "transform: translateX(" + 0 + "px)";
      }
    },
    //利用translateX实现按钮的移动
    getIconX() {
      this.$nextTick(() => {
        if (
            this.keyX.length > 0 &&
            this.theindex != -1 &&
            document.getElementsByClassName("keyItemBoxST").length != 0
        ) {
          let value =
              document
                  .getElementsByClassName("keyItemBoxST")
                  [this.theindex].getBoundingClientRect().left -
              document.querySelector("#time-lineST").getBoundingClientRect().left;
          document.getElementById("changiconST").style =
              "transform: translateX(" + value + "px)";
        } else {
          document.getElementById("changiconST").style =
              "transform: translateX(" + 0 + "px)";
        }
      });
    },
    // 添加点击时间条
    changeVideoTime(__index) {
      this.theindex = __index;
    },
    // 计算时间轴上时间的位置
    computeX() {
      this.keyX = [];
      let width = document
          .querySelector("#time-lineST")
          .getBoundingClientRect().width;
      //视频进度条像素宽度
      this.timeAll = this.myDate(this.nowYear);
      let time = this.timeKeyWordlist;
      var array = [];
      for (var j = 0; j < time.length; j++) {
        let keyTime = this.getDaysBetween(
            Number(this.nowYear) - 1 + "-12-31",
            time[j].image_time
        );
        let x = (keyTime / this.timeAll) * width;
        //TODO:
        x -=
            j *
            document.querySelector(".keyItemBoxST").getBoundingClientRect().width;
        array.push({
          title: time[j].image_time,
          transform: x, //时间占总时间的比例*位置
        });
        this.keyX = array; //二维数组
        this.theindex = 0;
      }
      this.scale();
    },
    // 滑动点击事件
    scale() {
      if (this.keyX.length > 0) {
        let self = this;
        let dragDiv = document.getElementById("changiconST");
        let leftX = document
            .querySelector("#time-lineST")
            .getBoundingClientRect().left;
        let rightX = document
            .querySelector("#time-lineST")
            .getBoundingClientRect().right;

        // 鼠标按下事件 处理程序
        let putDown = function (event1) {
          event1.cursor = "grabbing";
          document.onmousemove = function (event2) {
            let value = event2.clientX - leftX;
            if (event2.clientX < leftX) {
              dragDiv.style = "transform: translateX(" + 0 + "px)";
            }
            if (leftX < event2.clientX && event2.clientX < rightX) {
              dragDiv.style = "transform: translateX(" + value + "px)";
            }
            if (event2.clientX > rightX) {
              dragDiv.style =
                  "transform: translateX(" +
                  document.querySelector("#time-lineST").getBoundingClientRect()
                      .width +
                  "px)";
            }
          };
          // 鼠标抬起时，清除绑定在文档上的mousemove和mouseup事件
          // 否则鼠标抬起后还可以继续拖拽方块
          document.onmouseup = function (event3) {
            let value = event3.clientX - leftX;
            if (event3.clientX <= leftX) {
              self.theindex = self.keyX.length - 1;
            }
            if (leftX < event3.clientX && event3.clientX < rightX) {
              let arrr = [];
              self.keyX.forEach((item) => {
                arrr.push(item.transform);
              });
              self.theindex = self.findCloseNum(self.keyX, value);
            }
            if (event3.clientX >= rightX) {
              self.theindex = 0;
            }
            document.onmousemove = null;
            document.onmouseup = null;
            self.timeleft = event3.clientX;
            self.$forceUpdate();
          };
        };
        // 绑定鼠标按下事件
        dragDiv.addEventListener("mousedown", putDown, false);
      }
    },
    // 后一天
    reduceYear(val) {
      var d2 = new Date(val + "-03-1");
      d2.setFullYear(d2.getFullYear() - 1);
      d2.setDate(d2.getDate() - 1);
      this.nowYear = d2.toLocaleString().substr(0, 4);
      this.nextYear = val;
      this.getlist();
    },
    // 前一年
    addYear(val) {
      var d2 = new Date(val + "-03-01");
      d2.setFullYear(d2.getFullYear() + 1);
      d2.setDate(d2.getDate() - 1);
      this.nowYear = val;
      this.nextYear = d2.toLocaleString().substr(0, 4);
      this.getlist();
    },
    //获取指定年的天数
    myDate(t) {
      //t 代表指定的参数
      if (t == null) {
        var Year = new Date().getFullYear(),
            s = 0,
            d; //获取当前年
        for (var i = 1; i < 13; i++) {
          d = new Date(Year, i, 0); //获取某一个月的天数
          s += d.getDate();
        }
        return s;
      } else if (t >= 1970) {
        var Year = new Date().getFullYear(),
            s = 0,
            d;
        for (var i = 1; i < 13; i++) {
          d = new Date(t, i, 0);
          s += d.getDate();
        }
        return s;
      } else {
        return "年份有误";
      }
    },
    // 获取两个日期之间的天数
    getDaysBetween(dateString1, dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      // alert(days);
      return days;
    },
    // 初始获取当前年
    getYear() {
      let date = new Date();
      this.nowYear = date.getFullYear();
      this.nextYear = date.getFullYear() + 1;
      // this.nowYear = 2020;
      // this.nextYear = 2021;
    },

    // 查找最接近数值在数组中的索引
    findCloseNum(arr, num) {
      var index = 0; // 保存最接近数值在数组中的索引
      var d_value = Number.MAX_VALUE; // 保存差值绝对值，默认为最大数值
      for (var i = 0; i < arr.length; i++) {
        // var new_d_value = Math.abs(Number(arr[i].transform) - num); // 新差值
        //TODO:
        var new_d_value = Math.abs(
            Number(arr[i].transform) -
            num +
            i *
            document.querySelector(".keyItemBoxST").getBoundingClientRect()
                .width
        ); // 新差值
        if (new_d_value <= d_value) {
          // 如果新差值绝对值小于等于旧差值绝对值，保存新差值绝对值和索引
          if (
              new_d_value === d_value &&
              Number(arr[i].transform) < Number(arr[index].transform)
          ) {
            // 如果数组中两个数值跟目标数值差值一样，取大
            continue;
          }
          index = i;
          d_value = new_d_value;
        }
      }
      return index; // 返回最接近的数值
    },
  },
  mounted() {
    this.getYear();
    let self = this;
    window.onresize = () => {
      return (() => {
        self.getYear();
      })();
    };
    this.getlist();
  },
};
</script>
<style scoped>
.timeSwiper {
  position: absolute;
  top: 30%;
  left: 40%;
  z-index: 1;
  cursor: pointer;
}

.time-box {
  height: 70px;
  background: rgba(33, 43, 53, 0.8);
  border-radius: 6px;
  color: #cacfd3;
  display: flex;
  padding: 18px;
  -moz-user-select: none;
  /* Firefox */
  -webkit-user-select: none;
  /* WebKit */
  -ms-user-select: none;
  /* IE */
  -khtml-user-select: none;
  /* KHTML */
  -o-user-select: none;
  /* Opera */
  user-select: none;
  /* CSS3属性 */
}

.time-title {
  font-size: 14px;
  color: #ffffff;
  line-height: 28px;
  margin-right: 10px;
}

.tool-left,
.tool-right {
  font-size: 12px;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
  margin: 5px 2px;
  z-index: 99;
}

.icontime {
  font-size: 12px;
}

#time-lineST {
  width: 220px;
  height: 8px;
  background: rgba(33, 43, 53, 0.5);
  border-radius: 4px;
  margin: 14px 10px;
  box-sizing: content-box;
}

.keyItemBoxST {
  height: 100%;
  width: 1px;
  background: #33ce95;
  cursor: pointer;
  float: left;
}

.keyitemtitle {
  position: relative;
  width: 100px;
  text-align: center;
  top: -23px;
  right: 50px;
  font-size: 12px;
  line-height: 14px;
  display: table;
  color: #fff;
}

#changiconST {
  margin-top: -5px;
}

#triangleST {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 14px solid #ffffff;
  position: relative;
  left: -6.8px;
}

#triangleST:before {
  box-sizing: content-box;
  width: 0;
  height: 0;
  position: relative;
  top: 2px;
  right: 5px;
  padding: 0;
  display: block;
  content: "";
  z-index: 12;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid #33ce95;
}

#VerticalST {
  width: 1px;
  height: 18px;
  background: #fff;
}
</style>