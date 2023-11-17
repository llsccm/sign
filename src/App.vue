<template>
  <div id="app">
    <el-menu :default-active="activeIndex" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
      <el-menu-item index="/">模拟小程序签到</el-menu-item>
      <el-menu-item index="/vote" v-if="false">社区投票</el-menu-item>
      <el-menu-item index="/topup" v-if="isShow">自定义充值</el-menu-item>
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
      isShow: false
    }
  },
  mounted() {
    // console.log(this.$route.path)//懒加载导致路径不对
    this.activeIndex = this.$route.path
    window.location.hostname.includes('netlify.app') ? this.isShow = true : void 0
  },
  methods: {
    handleSelect(routePath) {
      this.activeIndex = routePath
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
html,body{
  height: 100%;
}

.wrapper {
  margin: 0 60px;
}

@media only screen and (max-width: 767px) {
  .wrapper {
    margin: 0;
  }
}
</style>