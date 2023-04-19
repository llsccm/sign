<template>
  <div class="form">
    <p>投票v1.0</p>
    <el-divider></el-divider>
    <el-form :model="user" status-icon label-width="80px" label-position="left" size="mini">
      <el-form-item label="账号" prop="account">
        <el-input v-model.trim="user.name"></el-input>
        <el-input v-model.trim="user.num"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="个数" prop="count">
        <el-input v-model="user.count" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="start(0)">开始投票</el-button>
      </el-form-item>
      <span>当前账号：</span><span>{{user.account}}</span>
    </el-form>
  </div>
</template>

<script>
import {login,pollVote} from '../api'
export default {
  name:'Vote',
  data() {
    return {
      user: {
        name: 'a',
        num:'001',
        password: '',
        account:'0',
        count:1
      },
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
    async start(next){
      // console.log('整合账号')
      let {name,num,password} = this.user
      num = Number(num) + Number(next)
      //补零
      let account = name + num.toString().padStart(3,0)
      this.user.account = account
      //登录
      let res = await login({account,password})
      if (res.code == '0') {
        let token = res.data.token
        this.$message({
          message: `${account}:${res?.msg}-${token}`,
          type: 'success'
        })
        //进行投票
        await this.wait(this.vote,{token,next})
      }else if(res.code == '11001'){
        this.$message({
          message: `${account}:${res?.msg}`,
          type: 'error'
        })
      }
    },
    async vote({token,next}){
      let {count,account} = this.user
      let res = await pollVote(token)
      if (res.code == '0') {
        this.$message({
          message: `${account}:投票${res?.msg}`,
          type: 'success'
        })
        console.log(account,'投票成功')
        if(next<count) {
          next++
          this.start(next)
        }
      }else if(res.code == '1'){
        console.log(account,res?.msg)
        if(next<count) {
          next++
          this.start(next)
        }
      }
    }
  },
}
</script>

<style>

</style>