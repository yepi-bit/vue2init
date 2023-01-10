<template>
  <div>
    <el-switch
        v-model="value"
        @change="changeDanMu"
        active-text="开启弹幕"
        inactive-text="关闭弹幕">
    </el-switch>
    <p>暂停弹幕：
      <el-button type="danger" :icon="start === 0 ? 'el-icon-video-pause':'el-icon-video-play'" circle
                 @click="pause"></el-button>
    </p>
    <vue-danmaku ref="dan" v-model="danmus" loop randomChannel isSuspend extraStyle="rgba(1,1,2,3)" :speeds=120 :right="10"
                 style="height:200px; width:100%;"></vue-danmaku>
    <div style="width: 30vw;margin: auto">
      <el-input placeholder="请输入需要发送的弹幕！" v-model="input" @keyup.enter.native="send">
        <el-button slot="append" @click="send">发送</el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  components: {
    vueDanmaku,
  },
  name: "Danmu",
  data() {
    return {
      value: true,
      start: 0,
      input: '',
      danmus: [
        "太好用了吧",
        "so easy",
        "效率大大提高呀",
        "还有精简版，还分国际化和非国际化，Perfect 😘",
        "好多组件呀，爱啦爱啦 ❤️",
        "精简版开发体验也太赞了吧 🙀",
        "Yepi真厉害呀",
        "哇塞，yepi 好多常用、易用的工具呀",
        "我要 star 这个项目，爱啦爱啦",
        "免费、开源做到这个程度，真不错 👍",
        "文档简单易懂，上手真快",
        "呀！还有免费的教学视频呢，我要去学习一下咯",
        "稳定、可靠，未来可期呀，加油！",
        "太卷了，太卷了，慢点让我跟上 😄"
      ]
    }
  },
  mounted() {
    console.log(this.$refs['dan'].extraStyle)
  },
  methods: {
    changeDanMu(op) {
      if (op === true) {
        this.$refs['dan'].show()
      } else {
        this.$refs['dan'].hide()
      }
    },
    send() {
      this.$refs['dan'].add(this.input)
      this.input = ''
    },
    pause() {
      if (this.start === 0) {
        this.$refs['dan'].pause()
        this.start = 1
      } else if (this.start === 1) {
        this.$refs['dan'].play()
        this.start = 0
      }
    },
  }
}
</script>

<style scoped>

</style>