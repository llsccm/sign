<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
      <el-menu-item index="/">模拟小程序签到</el-menu-item>
      <el-menu-item index="/vote">社区投票</el-menu-item>
      <el-menu-item index="/topup">自定义充值</el-menu-item>
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
      activeIndex: '/'
    }
  },
  mounted() {
    // console.log(this.$route.path)//懒加载导致路径不对
    this.activeIndex = this.$route.path
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
.fade-leave-to {
  display: none;
}
</style>