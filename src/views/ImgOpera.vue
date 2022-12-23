<template>
  <div id="look-image">
    <!-- 图片展示区 -->
    <div class="look-image-content">
      <div class="show-image">
        <img src="../assets/logo.png" alt="" ref="img" :style="styleObj" @mousedown="start" @mouseup="stop" @mousemove="move">
      </div>
    </div>
    <!-- 底部按钮操作去 -->
    <div class="look-image-footer">
      <div class="enlargement" @click="magnify">
        <i class=""></i>
        <span>放大</span>
      </div>
      <div class="shrink" @click="shrink">
        <i class=""></i>
        <span>缩小</span>
      </div>
      <div class="rotate" @click="rotate">
        <i class=""></i>
        <span>旋转</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImgOpera",
  data() {
    return {
      multiples: 1,       // 放大或者缩小
      deg: 0,             // 旋转的角度
      styleObj: null,       // 拖拽时修改图片的样式
      isDrag: false,      // 是否开始拖拽
      startX: 0,          // 鼠标的点击X轴
      startY: 0,          // 鼠标的点击Y轴
      moveX: 0,           // 鼠标移动的X轴
      moveY: 0,            // 鼠标移动的Y轴
      endX: 0,
      endY: 0,
    }
  },
  methods: {
    // 放大
    magnify() {
      if(this.multiples >= 10){
        return
      }
      this.multiples += 0.25;
      this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
    },
    // 缩小
    shrink() {
      if(this.multiples <= 0){
        return
      }
      this.multiples -= 0.25;
      this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
    },
    // 旋转
    rotate(){
      this.deg += 90;
      if(this.deg >= 360){
        this.deg = 0
      }
      this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
    },
    start(e) {
      console.log(e)
      // 当点击图片时，开始拖拽
      if (e.buttons) {
        this.isDrag = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
      }
    },
    stop() {
      this.isDrag = false;
      this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
    },
    move(e) {
      // 当鼠标拖拽图片的时候，才计算移动距离
      // 移动图片相对于父元素的位置
      if(this.isDrag) {
        // 鼠标移动的距离
        this.moveX = e.clientX;
        this.moveY = e.clientY;
        // 相对页面的距离
        let x=this.moveX-this.startX;
        let y=this.moveY-this.startY;
        let img=document.querySelector("#look-image img");
        this.endX = img.offsetLeft+x;
        this.endY = img.offsetLeft+y;
        this.styleObj=`left:${this.endX}px;top:${this.endY}px`;
        this.styleObj = `transform: scale(${this.multiples}) rotateZ(${this.deg}deg);left:${this.endX}px;top:${this.endY}px`;
        // 记录上次移动的距离
        this.startX=this.moveX;
        this.startY=this.moveY;
      }
    },
  }
}
</script>

<style lang="less" scoped>
#look-image {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 858px;
  height: 738px;
  background-color: #fefefe;
  border-radius: 10px;
  border: 1px solid #c5c5c5;
  overflow: hidden;
  z-index: 99;
  .look-image-content {
    width: 100%;
    border-bottom: 1px solid #c5c5c5;
    .show-image {
      margin: 44px 178px 74px;
      height: 539px;
      width: 562px;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .look-image-footer {
    display: flex;
    height: 80px;
    line-height: 80px;
    >div {
      width: 33%;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: #c5c5c5;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>