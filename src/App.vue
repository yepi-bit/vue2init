<template>
  <div id="app">
    <img style="float: left" width="182" height="116"
         src="https://static.nowcoder.com/fe/file/site/www-web/prod/1.0.174/imageAssets/b4b454fe980c8bf3aee6.png"
         alt="">
    <div id="nav">
      <router-link to="/">
        <el-button size="mini">Home</el-button>
      </router-link>
      |
      <router-link to="/about">
        <el-button size="mini">About</el-button>
      </router-link>
      |
      <router-link to="/imgOpera">
        <el-button size="mini">ImgOpera</el-button>
      </router-link>
    </div>
    <router-view/>
  </div>
</template>

<style scoped>
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
</style>
