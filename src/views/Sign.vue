<template>
  <el-row type="flex" justify="start" class="wrapper">
    <el-col :xs="24" :lg="20" :xl="14" class="table">
      <el-table :data="tableData" stripe size="medium" ref="table" fit>
        <el-table-column prop="account" label="游卡账号" width="330" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="accountTag">
              <el-tag size="small">{{ scope.row.account }}</el-tag>
            </div>
            <el-button size="mini" type="primary" @click="handleLogin(scope.$index, scope.row)">登录</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="password" label="密码" width="120"></el-table-column> -->
        <el-table-column prop="token" label="token" width="300"></el-table-column>
        <el-table-column label="任务" min-width="300">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="warning" @click="handleEdit(scope.row, scope.$index)">{{ editorButton }}</el-button> -->
            <!-- <el-button size="mini" type="info" @click="handleLike(scope.row)">回帖点赞</el-button> -->
            <el-button size="mini" type="info" @click="handleTopic(scope.row, $event)">点赞主题</el-button>
            <el-button size="mini" type="info" @click="handleBrowse(scope.row, $event)">浏览帖子</el-button>
            <!-- <el-button size="mini" type="info" @click="handleReply(scope.row,$event)">回帖</el-button> -->
            <!-- <el-button size="mini" type="info" @click="test">test</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-alert title="模拟三国杀ol社区微信小程序签到" type="warning" center show-icon description="token过期时间未知"> </el-alert>
      <el-alert title="已支持批量任务~" type="error" center> </el-alert>
      <el-alert title="使用了无服务器函数，访问接口会有一定的延迟" type="error" center> </el-alert>
      <div class="operation">
        <el-button :plain="true" type="info" @click="dialogFormVisible = true">添加账号</el-button>
        <el-button :plain="true" type="info" @click="allInfo">获取账号信息</el-button>
        <el-button :plain="true" type="info" @click="allSign">一键签到</el-button>
        <!-- <el-button :plain="true" type="info" @click="test">test</el-button> -->
      </div>
    </el-col>
    <el-dialog title="添加账号" :visible.sync="dialogFormVisible" center :close-on-click-modal="false" width="380px">
      <el-form :model="user" label-position="left" size="mini" label-width="40px">
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="user.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
        <el-button type="primary" size="mini" @click="add">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { login, getInfo, sign, getSignDay, like, browse, getthreadlist } from '@/api'
import { throttle } from 'lodash'
//import md5 from 'js-md5'
import { QueuePool } from '@/Utils/QueuePool'
export default {
  name: 'Sign',
  data() {
    return {
      tableData: [
        {
          account: '',
          password: '',
          token: '',
          oldToken: '',
          // tid: '',
          // pid: '',
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
        },
        {
          value: 4,
          label: '红玫瑰'
        },
        {
          value: 5,
          label: '天后'
        },
        {
          value: 6,
          label: '白鸽'
        },
        {
          value: 7,
          label: '相思'
        },
        {
          value: 8,
          label: '高山低谷'
        },
        {
          value: 9,
          label: '你永远不知道'
        },
        {
          value: 10,
          label: '梦在燃烧'
        },
        {
          value: 11,
          label: '千年之恋'
        }
      ],
      lrclist: [
        ['穿梭时间的画面的钟', '从反方向 开始移动', '回到当初爱你的时空', '停格内容 不忠', '迷迷蒙蒙 你给的梦', '出现裂缝 隐隐作痛', '怎么沟通你都没空', '说我不懂 说了没用', '他的笑容 有何不同', '在你心中 我不再受宠'],
        ['日出在印象的港口来回', '光线唤醒了睡着的花叶', '草地正为一场小雨欢悦', '我们彼此深爱这个世界', '停在康桥上的那只蝴蝶', '飞往午夜河畔的翡冷翠', '遗憾被偶然藏在了诗页', '是微笑都透不进的世界', '巴黎的鳞爪', '感伤的文法'],
        ['像我这样 成就或太牵强', '而像你这样 每一位也心痒', '清楚 你未暗示我 是我幻想', '给我想太多 导致内伤', '&#x8FF7;&#x836F;快过 回复正常', '够钟死心了', '当你沉默得高调', '当得我历劫低潮', '为何尚要打扰', '过几多通宵 至肯醒觉才愿退烧'],
        ['梦 缠绕的时候', '在我眼中', '昨日的痛楚如音符', '静静地飘过心中', '像烟雾弥漫', '想回味坚强的渴望', '你能否感到这迷惘', '让我痛楚让我欢畅', '让我的双眼蒙上', '尘封的幻想'],
        ['梦里梦到醒不来的梦', '红线里被软禁的红', '所有&#x523A;&#x6FC0;剩下疲乏的痛', '再无动于衷', '从背后抱你的时候', '期待的却是她的面容', '说来实在嘲讽我不太懂', '偏渴望你懂', '是否幸福轻得太沉重', '过度使用不痒不痛'],
        ['推开苍白的手推开苍白的厮守', '管你有多么失措', '别再叫我心软是最致命的脆弱', '我明明都懂却仍拼死效忠', '我嫉妒你的爱气势如虹', '像个人气高居不下的天后', '你要的不是我而是一种虚荣', '有人疼才显得多么出众', '我陷入盲目狂恋的宽容', '成全了你万众宠爱的天后'],
        ['飞翔吧 飞在天空', '用力吹吧 无情的风', '我不会害怕 也无须懦弱', '流浪的路 我自己走', '那是种骄傲 阳光的洒脱', '白云从我脚下掠过', '干枯的身影 憔悴的面容', '挥着翅膀 不再回头', '纵然带着永远的伤口', '至少我还拥有自由'],
        ['春又来看红豆开', '竟不见有情人去采', '烟花拥着风流真情不在', '最肯忘却古人诗', '最不屑一顾是相思', '守着爱怕人笑', '还怕人看清', '春又来看红豆开', '竟不见有情人去采', '烟花拥着风流真情不在'],
        ['愈望愈无望 未来没有我', '在断崖下 尽头吧 乐园未有过', '仿佛天一黑天一光挥发了一句再会', '只见人下堕', '快慰继续传播 你都不慰问我', '区分到太清楚 太严苛', '你快乐过生活 我拼命去生存', '几多人位于山之巅俯瞰我的疲倦', '渴望被成全 努力做人谁怕气喘', '但那终点 挂在那天边'],
        ['望着星斗满天', '都像是你的眼在烧', '看透我的伪装', '全都是为自己解套', '以为 已经 以后 已了', '都像无理取闹', '多少百转千回', '你怎么能够明了', '最怕有人问', '现在过得好不好'],
        ['深谋远虑都为今朝', '梦在燃烧', '问鼎三足怎落脚', '隆中对分晓', '只盼来日登蜀道', '再续出师表', '不鸣则已', '一鸣动九霄', '不出则已', '一出比天高'],
        ['风 狠狠的刮', '谁 在害怕', '海风一直眷恋着沙', '你却错过我的年华', '错过我新长的枝丫', '和我的白发', '蝴蝶依旧狂恋着花', '你却错过我的年华', '错过我转世的脸颊', '你还爱我吗']
      ],
      listIndex: 0,
      count: 0,
      threadTid: 1124997,
      dialogFormVisible: false,
    }
  },
  created() {
    //非响应式数据
    this.queuePool = new QueuePool()
  },
  mounted() {
    // this.clock()
    this.tableData = JSON.parse(localStorage.getItem('user')) || []
  },
  beforeUpdate() {
    this.$nextTick(() => {
      //在数据加载完，重新渲染表格
      this.$refs['table'].doLayout()
    })
  },
  computed: {
    content() {
      return this.lrclist[this.listIndex]
    }
  },
  methods: {
    //登录
    async handleLogin(index, row) {
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
          message: res?.msg || '网络异常',
          type: 'error'
        })
      }
    },
    //编辑
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
    //用户信息
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
    //签到
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
    //签到天数
    async signDay({ account, token }) {
      let res = await getSignDay(token)
      this.$notify({
        title: `${account}`,
        message: `已签到:${res?.data?.clockDays}天`,
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
      this.dialogFormVisible = false
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
    wait(cb, params, time = 1500) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(cb(params))
        }, time)
      })
    },
    running(e) {
      // console.log(e)
      if (e.target.nodeName == 'SPAN') {
        e.target.parentNode.classList.add('running')
        e.target.parentNode.blur()
      } else {
        e.target.classList.add('running')
        e.target.blur()
      }
    },
    taskStatus(e, status = true) {
      let target
      e.target.nodeName == 'SPAN' ? (target = e.target.parentNode) : (target = e.target)
      target.classList.remove('running')
      target.style.backgroundColor = status ? '#67c23a' : '#ff3333'
    },
    //主题帖点赞 最新帖子 5次
    handleTopic: throttle(function (row, e) {
      this.running(e)
      this.queuePool.addQueue(() =>
        this.taskQueue({
          cb: this.topicLike,
          count: 5,
          token: row.token,
          e,
          msg: '点赞'
        }).catch((e) => {
          console.log(e)
        })
      )
    }, 2000),
    //主题帖点赞 最新帖子
    async topicLike({ token, tid, executions }) {
      let res = await like({ token, tid })
      console.log('like', res)
      if (res?.status == 401) return '401'
      if (res?.code == '0') {
        this.$message({
          message: `点赞帖子${tid},已完成${executions + 1}次`,
          type: 'success'
        })
        return 'success'
      } //else if (res?.code == '15005') {
      return 'skip'
    },
    //浏览帖子 最新帖子 5+2次
    handleBrowse: throttle(function (row, e) {
      this.running(e)
      this.queuePool.addQueue(() =>
        this.taskQueue({
          cb: this.browse,
          count: 7,
          token: row.token,
          e,
          msg: '浏览'
        }).catch((e) => {
          console.log(e)
        })
      )
    }, 2000),
    //浏览帖子
    async browse({ token, tid, executions }) {
      let res = await browse({ token, tid })
      if (res?.status == 401) return '401'
      if (res?.code == '0') {
        this.$message({
          message: `浏览帖子${tid},已完成${executions + 1}次`,
          type: 'success'
        })
        return 'success'
      } //else if (res?.code == '15002') {
      return 'skip'
    },
    async taskQueue({ cb, count, token, e, msg }) {
      const res = await getthreadlist()
      let executions = 0
      return new Promise(async (resolve, reject) => {
        if (res?.code != '0') {
          this.$message({
            message: '获取帖子列表失败',
            type: 'error'
          })
          reject('error')
          return
        }

        let tid = res.data?.list.length > 0 ? res.data?.list[0].tid : 1124997
        while (executions < count) {
          const resp = await this.wait(cb, { token, tid, executions })
          if (resp == 'success') {
            executions++
          } else if (resp == '401') {
            break
          }
          tid--
        }

        this.$message({
          message: `完成${msg}:${executions}次`,
          type: 'success'
        })

        if (executions == count) {
          this.taskStatus(e)
          resolve('success')
        } else {
          this.taskStatus(e, false)
          reject('401')
        }
      })
    }
  }
}
</script>

<style>
.table {
  padding: 4px 0 2px 30px;
}

.accountTag {
  width: 170px;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  margin-right: 4px;
}

@media only screen and (max-width: 767px) {
  .table {
    padding: 0 5px;
  }
}

.table input {
  width: 80px;
}

.operation {
  margin-top: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
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
  font-family: 'Microsoft Yahei', Arial, Helvetica, sans-serif;
  font-size: 14px;
}

button.running {
  background-image: linear-gradient(to right, #fa7777 0%, #fa7777 50%, #fca5a5 50%, #fca5a5 100%);
  background-size: 200% 100%;
  background-position: 50%;
  animation: 1s run infinite;
}

@keyframes run {
  from {
    background-position: 100%;
  }
  to {
    background-position: 0%;
  }
}
</style>
