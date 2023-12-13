<template>
  <div class="container" ref="container" @scroll="handleScroll">
    <div class="content" :style="{ height: totalHeight + 'px' }">
      <div v-for="item in visibleItems" :key="item.id" class="item">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {text:'11'},
        {text:'12'},
        {text:'13'},
        {text:'14'},
        {text:'15'},
        {text:'16'},
        {text:'17'},
        {text:'18'},
        {text:'19'},
        {text:'20'},
        {text:'21'},
        {text:'22'},
      ], // 你的数据列表
      containerHeight: 300, // 容器高度
      itemHeight: 50, // 单个条目的高度
      scrollTop: 0, // 容器的滚动距离
    };
  },
  computed: {
    totalHeight() {
      return this.items.length * this.itemHeight;
    },
    visibleItems() {
      const startIndex = Math.floor(this.scrollTop / this.itemHeight);
      const endIndex = Math.min(
          startIndex + Math.ceil(this.containerHeight / this.itemHeight),
          this.items.length - 1
      );
      return this.items.slice(startIndex, endIndex + 1);
    },
  },
  methods: {
    handleScroll() {
      this.scrollTop = this.$refs.container.scrollTop;
    },
  },
};
</script>

<style>
.container {
  height: 300px; /* 容器高度 */
  overflow-y: scroll; /* 显示滚动条 */
  position: relative;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #67a2de;
}

.item {
  height: 50px; /* 单个条目的高度 */
  line-height: 50px;
  color: white;
}
</style>
