<template>
  <div id="app">
    <el-menu id="el-menu-nav" :default-active="activeIndex" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
      <el-menu-item index="/">模拟小程序签到</el-menu-item>
      <el-menu-item index="/vote" v-if="false">社区投票</el-menu-item>
      <el-menu-item index="/topup" v-if="isShow">自定义充值</el-menu-item>
      <el-switch class="darkSwitch" v-model="mode" @change="changeMode" active-icon-class="el-icon-moon" active-value="dark" active-color="#5e7987" inactive-icon-class="el-icon-sunny" inactive-value="light" inactive-color="#c0c4c3"> </el-switch>
    </el-menu>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeIndex: '/',
      isShow: false,
      mode: 'light'
    }
  },
  mounted() {
    // console.log(this.$route.path)//懒加载导致路径不对
    this.activeIndex = this.$route.path
    window.location.hostname.includes('netlify.app') ? (this.isShow = true) : void 0
  },
  methods: {
    handleSelect(routePath) {
      this.activeIndex = routePath
    },
    changeMode() {
      const html = document.querySelector('html')
      // this.isDark = !this.isDark
      this.mode == 'dark' ? html.classList.add('dark') : html.classList.remove('dark')
    }
  },
  watch: {
    // 监听路由变化
    '$route.path': {
      handler(routePath) {
        this.handleSelect(routePath)
      }
    }
  }
}
</script>

<style>
:root {
  color-scheme: light dark;
  --border-color: #dcdfe6;
  --bg-color: #ffffff;
  --el-text-color: #606266;
}

.dark {
  --border-color: #4c4d4f;
  --bg-color: #141414;
  --el-text-color: #cfd3dc;
  --text-color: #e5eaf3;
}

html.dark {
  color: var(--text-color);
  background-color: var(--bg-color);
}

html,
body {
  height: 100%;
}

.wrapper {
  margin: 20px 60px 0;
  overflow: auto;
}

#el-menu-nav {
  padding: 0 30px;
}

.darkSwitch {
  position: relative;
  top: 20px;
  left: 10px;
}

@media only screen and (max-width: 767px) {
  .wrapper {
    margin: 0;
  }
}
</style>
