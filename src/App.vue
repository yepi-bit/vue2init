<template>
  <div id="app">
    <img style="float: left" width="182" height="116"
         src="https://static.nowcoder.com/fe/file/site/www-web/prod/1.0.174/imageAssets/b4b454fe980c8bf3aee6.png"
         alt="">
    <div id="nav">
      <span :style="{color : widths ? getRandomColor : ''}">{{ widths }}</span>
      <router-link to="/">
        <el-button size="mini">Home</el-button>
      </router-link>
      |
      <router-link :to="{path:'/about',query:{t: new Date()}}">
        <el-button size="mini">About</el-button>
      </router-link>
      |
      <router-link to="/imgOpera">
        <el-button size="mini">ImgOpera</el-button>
      </router-link>
      |
      <router-link to="/gridData">
        <el-button size="mini">GridData</el-button>
      </router-link>
      |
      <router-link to="/danmu">
        <el-button size="mini">Danmu</el-button>
      </router-link>
      |
      <router-link to="/dynamicRouter">
        <el-button size="mini">DynamicRouter</el-button>
      </router-link>
    </div>
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <keep-alive :include="['about','imgOpera']">
          <component :is="Component"/>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script>
import routes from "./router/index.js";

export default {
  data() {
    return {
      transitionName: 'go',
      widths: 0
    }
  },
  activated() {
    // 当缓存组件有被显示出来时，会触发这个钩子函数
    console.log(100);
  },
  deactivated() {
    // 当缓存的组件隐藏时，会触发这个钩子函数；
    console.log(200);
  },
  errorCaptured(err) {
    console.log(err)
  },
  watch: {
    '$route'(to, from) {
      let noAnimation = ['/', '/imgOpera']
      if (noAnimation.indexOf(from.path) !== -1 && noAnimation.indexOf(to.path) !== -1) {
        console.log('只有第一次进入')
        return this.transitionName = ''
      }
      const toDepth = routes.options.routes.findIndex(v => v.path === to.path)
      const fromDepth = routes.options.routes.findIndex(v => v.path === from.path)
      this.transitionName = toDepth > fromDepth ? 'go' : 'back'
      console.log(this.transitionName)
    },
    widths: {
      handler(news, olds) {
        window.onresize = () => {
          return (() => {
            this.widths = document.body.clientWidth
          })()
        }
      }, immediate: true
    }
  },
  computed: {
    getRandomColor() {
      if (this.widths) {
        return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
      }
    }
  }
}
</script>
<style lang="less">
@media (prefers-color-scheme: dark) {
  color: royalblue;
}

@media (prefers-color-scheme: light) {
  color: cadetblue;
}

::-webkit-scrollbar-thumb {
  background-color: transparent;
}

::-webkit-scrollbar {
  background-color: transparent;
}

@media screen and (max-width: 1024px) {
  body {
    background-color: rgba(0, 0, 0, .3);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

img {
  animation: move 2s infinite;
  -webkit-animation: move 2s infinite;
}

@keyframes move {
  25% {
    transform: translateY(-6px);
  }
  50%, 100% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(6px);
  }
}


#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.go-enter-from {
  transform: translate3d(100%, 0, 0);
}

.back-enter-to, .back-enter-from, .go-enter-to, .go-leave-from {
  transform: translate3d(0, 0, 0);
}

.go-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.go-enter-active, .go-leave-active, .back-enter-active, .back-leave-active {
  transition: all .3s;
}

.back-enter-from {
  transform: translate3d(-100%, 0, 0);
}

.back-leave-to {
  transform: translate3d(100%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
