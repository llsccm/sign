<template>
  <div class="container">
    <h1 class="display-5">三国杀ol自定义95折充值</h1>
    <el-alert class="tips" title="杀批！请选择常见的元宝数额 Example: 600/0.95=632" type="error" :closable="false"></el-alert>
    <el-alert class="tips" title="务必先充值6元查看是否到账" type="error" :closable="false"> </el-alert>
    <div class="pay-list">
      <el-button type="warning" plain v-for="(item, index) in list" :key="index" @click="modifyAmount(item)">
        {{ item }}
      </el-button>
    </div>
    <el-form class="topup" :model="user" status-icon label-width="80px" label-position="left" size="mini">
      <el-form-item label="账号" prop="account">
        <el-input v-model.trim="user.account" placeholder="account"></el-input>
      </el-form-item>
      <el-form-item label="元宝数量" prop="amount">
        <el-input v-model.trim="user.amount" placeholder="单位为元宝"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" round @click="getInfo">信息检测</el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-descriptions title="充值信息" :column="1">
      <el-descriptions-item label="角色信息">{{ userinfo }}</el-descriptions-item>
      <el-descriptions-item label="元宝数量">{{ user.amount }}</el-descriptions-item>
      <el-descriptions-item label="支付金额">{{ price }}</el-descriptions-item>
    </el-descriptions>
    <div class="paytype">
      <el-button type="primary" @click="alipay">支付宝</el-button>
      <el-button type="success" @click="wxpay">微信支付</el-button>
    </div>
    <!-- <div class="code" v-if="qrimage">
      <img :src="qrimage">
    </div> -->
    <el-dialog title="付款码" :visible.sync="dialogVisible" width="300px" :close-on-click-modal="false">
      <span>支付方式不同会有差异，请仔细核对付款金额</span>
      <el-image :src="qrimage" class="image-slot">
        <div slot="placeholder">
          <span>图片加载中...</span>
        </div>
      </el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Topup',
  data() {
    return {
      user: {
        name: '昵称',
        level: 0,
        account: '0',
        amount: 0,
      },
      flag: false,
      list: [600, 1200, 3000, 6000, 12800, 32800, 64800],
      dialogVisible: false,
      qrimage: ''
    }
  },
  computed: {
    userinfo() {
      const { name, level } = this.user
      return `Lv.${level}_${name}`
    },
    price() {
      return Math.round(this.user.amount * 0.95 / 100)
    }
  },
  mounted() {
    this.user.account = localStorage.getItem('account') || '0'
  },
  methods: {
    async getInfo() {
      const account = this.user.account
      const olUrl = `https://web.sanguosha.com/login/ol/nickname.html?account=${account}`
      const res = await fetch(olUrl)
      const data = await res.json()
      if (data.code === 0) {
        localStorage.setItem('account', account)
        this.flag = true
        this.user.name = data.data.Name
        this.user.level = data.data.Level
        if (!this.user.amount) this.user.amount = 632
      }
    },
    modifyAmount(amount) {
      this.user.price = Number(amount / 100)
      this.user.amount = Math.round(amount / 0.95)
    },
    async alipay() {
      if (!this.flag) {
        this.$message({
          message: '请检测一次角色信息',
          type: 'error'
        })
        return
      }
      const url = 'https://payment.sanguosha.com/ol/qr_pay/alipay/qrcode/info'
      let options = {}
      options.headers = {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site'
      }
      options.referrerPolicy = 'strict-origin-when-cross-origin'
      options.method = 'POST'
      options.mode = 'cors'
      const { account, amount } = this.user
      options.body = `account=${account}&yuanbao=${amount}&page_from=0&channelid=210000`
      const res = await fetch(url, options)
      const data = await res.json()
      if (data.result === 'SUCCESS') {
        this.qrimage = data.qrcode_img_url
        this.dialogVisible = true
      }
    },
    async wxpay() {
      if (!this.flag) {
        this.$message({
          message: '请检测一次角色信息',
          type: 'error'
        })
        return
      }
      const { account, amount } = this.user
      let url = `https://payment.sanguosha.com/ol/qr_pay/wechat/order/create?account=${account}&yuanbao=${amount}&page_from=0&channelid=210000`
      const res = await fetch(url)
      const orderData = await res.json()
      if (orderData.code == 0) {
        const { order_id } = orderData.data
        const qrRes = await fetch(`https://payment.sanguosha.com/ol/qr_pay/wechat/qrcode/show?order_id=${order_id}&`)
        const qrData = await qrRes.json()
        this.qrimage = qrData.data.qr_image
        this.dialogVisible = true
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 0 40px;
  width: 650px;
}
.tips {
  width: 500px;
  margin-top: 5px;
}
.topup {
  width: 300px;
}
.userinfo {
  background: #fde2e2;
}
.pay-list {
  padding: 10px 0;
}
.paytype {
  padding-top: 10px;
}
.image-slot {
  width: 256px;
  height: 256px;
}
</style>
