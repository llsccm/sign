<template>
  <div class="voteform">
    <p>投票v1.1</p>
    <el-divider></el-divider>
    <el-form :model="user" status-icon label-width="80px" label-position="left" size="mini">
      <el-form-item label="账号" prop="account">
        <el-input v-model.trim="user.name" placeholder="前缀"></el-input>
        <el-input v-model.trim="user.num" placeholder="后缀(3位数字，可以为空)"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="额外个数" prop="count">
        <el-input v-model="user.count" autocomplete="off" placeholder="为0则只执行一次"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="start(0)">开始投票</el-button>
      </el-form-item>
      <span>当前账号：</span><span>{{ user.account }}</span>
    </el-form>
  </div>
</template>

<script>
import { login, pollVote } from '../api'
export default {
  name: 'Vote',
  data() {
    return {
      user: {
        name: 'a',
        num: '001',
        password: '',
        account: 'a001',
        count: 0
      }
    }
  },
  methods: {
    wait(cb, params, time = 2000) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // console.log(new Date())
          resolve(cb(params))
        }, time)
      })
    },
    async start(next) {
      // console.log('整合账号')
      let { name, num, password, count } = this.user
      if (num) {
        num = Number(num) + Number(next)
        num = num.toString().padStart(3, 0)
      }
      //补零
      let account = name + num
      this.user.account = account
      //登录
      let res = await login({ account, password })
      if (res.code == '0') {
        let token = res.data.token
        this.$message({
          message: `${account}:${res?.msg}-${token}`,
          type: 'success'
        })
        //进行投票
        await this.wait(this.vote, token)
        if (next < count) {
          next++
          this.start(next)
        }
      } else if (res.code == '11001') {
        this.$message({
          message: `${account}:${res?.msg}`,
          type: 'error'
        })
        console.log(account, '登录失败,中止执行')
      }
    },
    async vote(token) {
      let { account } = this.user
      let res = await pollVote(token)
      if (res.code == '0') {
        this.$message({
          message: `${account}:投票${res?.msg}`,
          type: 'success'
        })
        console.log(account, '投票成功')
      } else if (res.code == '1') {
        console.log(account, res?.msg)
      }
    }
  }
}
</script>

<style>
.voteform {
  padding: 20px 40px;
  width: 400px;
}
</style>