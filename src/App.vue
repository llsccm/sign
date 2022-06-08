<template>
  <div id="app">
    <el-menu
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">模拟小程序签到</el-menu-item>
      <el-menu-item>
        <el-link href="/pay" target="_blank" :underline="false">自定义充值</el-link>
      </el-menu-item>
    </el-menu>
    <el-row>
      <el-col :span="12">
        <div class="table">
          <el-table :data="tableData" stripe size="medium">
            <el-table-column prop="account" label="账号" width="150"></el-table-column>
            <el-table-column prop="password" label="密码" width="150"></el-table-column>
            <el-table-column prop="Authenticate" label="token" width="300"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary"
                  @click="handleLogin(scope.$index, scope.row)">登录</el-button>
                  <el-button size="mini" type="danger" 
                  @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
          <el-alert title="token过期时间未知" type="warning" show-icon center></el-alert>
        <div class="button">
          <el-button :plain="true" type="info" @click="allInfo">获取信息</el-button>
          <el-button :plain="true" type="info" @click="allSign">签到</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="form">
          <el-form :model="user" status-icon label-width="80px" label-position="left" size="mini">
            <el-form-item label="账号" prop="account">
              <el-input v-model.number="user.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="text" v-model="user.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login, getInfo, sign, getSignDay } from './api'
export default {
  name: 'App',
  data() {
    return {
      tableData: [
        {
          account: '',
          password: '',
          Authenticate: '',
        },
      ],
      user: {
        account: '',
        password: '',
      },
    }
  },
  mounted() {
    // this.clock()
    this.tableData = JSON.parse(localStorage.getItem('user')) || []
  },
  computed:{
  },
  methods: {
    async handleLogin(index, row) {
      let res = await login({
        account: row.account,
        password: row.password,
      })
      if (res.code == '0') {
        this.tableData[index].Authenticate = res.data.token
        this.$message({
          message: res.msg,
          type: 'success',
        })
        localStorage.setItem('user', JSON.stringify(this.tableData))
      }else{
        this.$notify({
          title: row.account,
          message: res.msg,
          type: 'error'
        })
      }
    },
    async info({token, account}) {
      let res = await getInfo(token)
      if (res.code == '0') {
        console.log(res.data)
        this.$notify({
          title: account,
          message: `${res.data?.old.area}: ${res.data?.old.name}`,
          // type: 'success',
        })
      }
    },
    async clock({account, token}) {
      let res = await sign(token)
      if (res.code == '0') {
        this.$message({
          message: res.msg,
          type: 'success',
        })
      }else if(res.code == '1'){
        this.$notify({
          title: account,
          message:res.msg,
          duration: 0
        })
      }else{
        this.$message({
          message: res.msg,
          type: 'error',
        }) 
      }
      this.signDay({account, token})
    },
    async signDay({account, token}) {
      let res = await getSignDay(token)
      this.$notify({
        title: `${account}`,
        message:`已签到:${res.data.clockDays}天`,
        duration: 0
      })
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
      localStorage.setItem('user', JSON.stringify(this.tableData))
    },
    add() {
      if(this.user.account == '' || this.user.password == ''){
        this.$message({
          message: '账号或密码不能为空',
          type: 'error',
        })
        return
      }
      if(this.tableData.some(item => item.account == this.user.account)){
        this.$message({
          message: '账号已存在',
          type: 'error',
        })
        return
      }
      this.tableData.push({
        account: this.user.account,
        password: this.user.password,
        Authenticate:'',
      })
    },
    allSign(){
      this.tableData.forEach(item => {
        if (item.Authenticate) {
          // console.log(item.Authenticate)
          // this.$store.dispatch('setToken', item.Authenticate)
          this.clock({token:item.Authenticate,account:item.account})
        }else{
          this.$message({
            message: `${item.account}未登录`,
            type: 'error',
          })
        }
      })
    },
    allInfo(){
      this.tableData.forEach(item => {
        if (item.Authenticate) {
          this.info({token:item.Authenticate,account:item.account})
        }else{
          this.$message({
            message: `${item.account}未登录`,
            type: 'error',
          })
        }
      })
    }
  },
}
</script>

<style>
.table {
  margin-left: 50px;
}
.button {
  margin-top: 20px;
  text-align: center;
}
.form {
  padding: 20px;
  padding-top: 40px;
  width: 400px;
}
</style>
