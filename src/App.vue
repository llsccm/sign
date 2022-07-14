<template>
  <div id="app">
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1">模拟小程序签到</el-menu-item>
      <el-menu-item>
        <el-link href="https://llsccm.github.io/sgstools/" target="_blank" :underline="false">自定义充值</el-link>
      </el-menu-item>
    </el-menu>
    <el-row>
      <el-col :span="16">
        <div class="table">
          <el-table :data="tableData" stripe size="medium">
            <el-table-column prop="account" label="游卡账号" width="200"></el-table-column>
            <!-- <el-table-column prop="password" label="密码" width="120"></el-table-column> -->
            <el-table-column prop="token" label="token" width="300"></el-table-column>
            <el-table-column prop="tid" label="tid" width="110">
              <template slot-scope="scope">
                <input type="text" v-model="scope.row.tid" v-show="scope.row.iseditor" />
                <span v-show="!scope.row.iseditor">{{ scope.row.tid }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="pid" label="要点赞的pid" width="120">
              <template slot-scope="scope">
                <input type="text" v-model="scope.row.pid" v-show="scope.row.iseditor" />
                <span v-show="!scope.row.iseditor">{{ scope.row.pid }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="otherTid" label="otherTopic" width="120">
              <template slot-scope="scope">
                <input type="text" v-model="scope.row.otherTid" v-show="scope.row.iseditor" />
                <span v-show="!scope.row.iseditor">{{ scope.row.otherTid }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                <el-button size="mini" type="primary" @click="handleLogin(scope.$index, scope.row)">登录</el-button>
                <el-button size="mini" type="warning" @click="handleEdit(scope.row, scope.$index)">{{ editorButton }}</el-button>
                <el-button size="mini" type="info" @click="handleLike(scope.row)">回帖点赞</el-button>
                <el-button size="mini" type="info" @click="handleTopic(scope.row)">点赞主题</el-button>
                <el-button size="mini" type="info" @click="handleReply(scope.row)">回帖</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-alert title="模拟三国杀ol社区微信小程序签到" type="warning" center show-icon description="token过期时间未知"> </el-alert>
        <el-alert title="使用了无服务器函数，访问接口会有一定的延迟" type="error" center> </el-alert>
        <div class="button">
          <el-button :plain="true" type="info" @click="allInfo">获取账号信息</el-button>
          <el-button :plain="true" type="info" @click="allSign">一键签到</el-button>
          <!-- <el-button :plain="true" type="info" @click="reply">test</el-button> -->
        </div>
      </el-col>
      <el-col :span="8">
        <div class="form">
          <el-form :model="user" status-icon label-width="80px" label-position="left" size="mini">
            <el-form-item label="账号" prop="account">
              <el-input v-model.trim="user.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="select">
          <p>回帖内容选择</p>
          <el-select v-model="listIndex" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login, getInfo, sign, getSignDay, like, dislike, postlike, postdislike, getVerify, create } from './api'
import { throttle, debounce } from 'lodash'
import md5 from 'js-md5'
export default {
  name: 'App',
  data() {
    return {
      tableData: [
        {
          account: '',
          password: '',
          token: '',
          tid: '',
          pid: '',
          // otherTid: '',
          iseditor: false
        }
      ],
      user: {
        account: '',
        password: ''
      },
      editorButton: '编辑',
      options: [
        {
          value: 0,
          label: '反方向的钟'
        },
        {
          value: 1,
          label: '最伟大的作品'
        },
        {
          value: 2,
          label: '够钟'
        },
        {
          value: 3,
          label: '梦缠绕的时候'
        }
      ],
      lrclist: [
        ['穿梭时间的画面的钟', '从反方向 开始移动', '回到当初爱你的时空', '停格内容 不忠', '迷迷蒙蒙 你给的梦', '出现裂缝 隐隐作痛', '怎么沟通你都没空', '说我不懂 说了没用', '他的笑容 有何不同', '在你心中 我不再受宠'],
        ['日出在印象的港口来回', '光线唤醒了睡着的花叶', '草地正为一场小雨欢悦', '我们彼此深爱这个世界', '停在康桥上的那只蝴蝶', '飞往午夜河畔的翡冷翠', '遗憾被偶然藏在了诗页', '是微笑都透不进的世界', '巴黎的鳞爪', '感伤的文法'],
        ['像我这样 成就或太牵强', '而像你这样 每一位也心痒', '清楚 你未暗示我 是我幻想', '给我想太多 导致内伤', '&#x8FF7;&#x836F;快过 回复正常', '够钟死心了', '当你沉默得高调', '当得我历劫低潮', '为何尚要打扰', '过几多通宵 至肯醒觉才愿退烧'],
        ['梦 缠绕的时候', '在我眼中', '昨日的痛楚如音符', '静静地飘过心中', '像烟雾弥漫', '想回味坚强的渴望', '你能否感到这迷惘', '让我痛楚让我欢畅', '让我的双眼蒙上', '尘封的幻想']
      ],
      listIndex: 0,
      count: 0
    }
  },
  mounted() {
    // this.clock()
    this.tableData = JSON.parse(localStorage.getItem('user')) || []
  },
  computed: {
    content() {
      return this.lrclist[this.listIndex]
    }
  },
  methods: {
    async handleLogin(index, row) {
      //登录
      let res = await login({
        account: row.account,
        password: row.password
      })
      if (res?.code == '0') {
        this.tableData[index].token = res.data.token
        this.tableData[index].iseditor = false
        this.$message({
          message: res?.msg,
          type: 'success'
        })
        localStorage.setItem('user', JSON.stringify(this.tableData))
      } else {
        this.$notify({
          title: row.account,
          message: res?.msg,
          type: 'error'
        })
      }
    },
    handleEdit(row, index) {
      console.log(row)
      row.iseditor = !row.iseditor
      // row.pid = 1
      this.editorButton = row.iseditor ? '保存' : '编辑'
      if (!row.iseditor) {
        this.tableData[index] = row
        localStorage.setItem('user', JSON.stringify(this.tableData))
      }
    },
    async info({ token, account }) {
      let res = await getInfo(token)
      if (res?.code == '0') {
        console.log(res.data)
        this.$notify({
          title: account,
          message: `${res.data?.old.area}: ${res.data?.old.name}`
          // type: 'success',
        })
      }
    },
    async clock({ account, token }) {
      let res = await sign(token)
      if (res?.code == '0') {
        this.$message({
          message: `${res.data.name}, ${res.data.num}`,
          type: 'success'
        })
        this.signDay({ account, token })
      } else if (res?.code == '1') {
        this.$notify({
          title: account,
          message: res.msg,
          duration: 0
        })
        this.signDay({ account, token })
      } else {
        this.$message({
          message: res?.msg || '连接异常',
          type: 'error'
        })
      }
    },
    async signDay({ account, token }) {
      let res = await getSignDay(token)
      this.$notify({
        title: `${account}`,
        message: `已签到:${res?.data.clockDays}天`,
        duration: 0
      })
    },
    handleDelete(index) {
      this.$confirm('删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData.splice(index, 1)
          localStorage.setItem('user', JSON.stringify(this.tableData))
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    add() {
      if (this.user.account == '' || this.user.password == '') {
        this.$message({
          message: '账号或密码不能为空',
          type: 'error'
        })
        return
      }
      if (this.tableData.some((item) => item.account == this.user.account)) {
        this.$message({
          message: '账号已存在',
          type: 'error'
        })
        return
      }
      this.tableData.push({
        account: this.user.account,
        password: this.user.password,
        token: ''
      })
      this.user.account = ''
      this.user.password = ''
    },
    //一键签到所有账号
    async allSign() {
      const length = this.tableData.length
      for (let i = 0; i < length; i++) {
        if (this.tableData[i].token) {
          const { account, token } = this.tableData[i]
          await this.wait(this.clock, { account, token })
        } else {
          this.$message({
            message: `${this.tableData[i].account}未登录`,
            type: 'error'
          })
        }
      }
    },
    allInfo: throttle(function () {
      this.tableData.forEach((item) => {
        if (item.token) {
          this.info({ token: item.token, account: item.account })
        } else {
          this.$message({
            message: `${item.account}未登录`,
            type: 'error'
          })
        }
      })
    }, 5000),
    wait(cb, params,time=2000) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // console.log(new Date())
          resolve(cb(params))
        }, time)
      })
    },
    test: throttle(function () {
      console.log('节流')
    }, 5000),
    //给别人回复点赞10次
    async handleLike(row) {
      let { token, pid, tid } = row
      if (!pid || !tid) {
        this.$message({
          message: '未填写帖子tid或pid',
          type: 'error'
        })
        return
      }
      this.count = 0
      while (this.count < 10) {
        await this.wait(this.likeTask, { token, pid, tid })
      }
    },
    //主题帖点赞5次
    async handleTopic(row) {
      this.count = 0
      while (this.count < 5) {
        await this.wait(this.topicLike, row.token)
      }
    },
    // 给别人回帖点赞
    async likeTask({ token, pid, tid }) {
      let res = await postdislike({ token, pid, tid })
      if (res?.code == '0' || res?.code == '15006') {
        let res2 = await postlike({ token, pid, tid })
        if (res2?.code == '0') {
          this.count++
          this.$message({
            message: `已点赞回帖${this.count}次`,
            type: 'success'
          })
        }
      }
    },
    //主题帖点赞 固定帖子
    async topicLike(token) {
      let res = await dislike(token)
      if (res?.code == '15006' || res?.code == '0') {
        let res2 = await like(token)
        console.log('like', res2)
        if (res2?.code == '0') {
          this.count++
          this.$message({
            message: `已点赞${this.count}次`,
            type: 'success'
          })
        }
      }
    },
    //回复某帖
    async replyto({ token, verify, message }) {
      let res = await create({ token, verify, message })
      if (res?.code == '0') {
        this.$message({
          message: res?.data.post.message,
          type: 'success'
        })
        this.count++
      }
    },
    //回复帖子 固定帖子10次
    async reply(token) {
      let res = await getVerify(token) //获取safetoken
      if (res?.code == '0') {
        let safe = res.data.verify_token
        while (this.count < 10) {
          let message = this.content[this.count]
          let verify = md5(message.length + safe)
          await this.wait(this.replyto, { token, verify, message }, 5000)
        }
      }
    },
    handleReply: throttle(function (row) {
      this.count = 0
      this.reply(row.token)
    }, 5000)
  }
}
</script>

<style>
.table {
  margin-left: 50px;
}
.table input {
  width: 80px;
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
.select {
  padding-left: 20px;
}
.select > p {
  font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
  font-size: 14px;
}
</style>