<template>
  <div class="form">
    <p>微信公众号打卡cookie设置</p>
    <el-divider></el-divider>
    <el-form  status-icon label-width="auto" label-position="left" size="small">
      <!-- <el-form-item label="XSRF-TOKEN" prop="XSRF-TOKEN">
        <el-input v-model.trim="XSRF_TOKEN" autocomplete="off"></el-input>
      </el-form-item> -->
      <el-form-item label="laravel_session" prop="laravel_session">
        <el-input type="text" v-model.trim="laravel_session" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setCookie">设置cookie</el-button>
        <el-tooltip placement="bottom">
          <div slot="content">注意事项<br/>
          需要使用抓包工具抓取cookie，难度较大<br/>
          设置前建议先清空cookie，具体方法这里空白的地方太小，写不下<br/>
          每次打卡都需要设置cookie</div>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'Clock',
  data() {
    return {
      XSRF_TOKEN:'',
      laravel_session:''
    }
  },
  methods: {
    setCookie(){
      let exp = new Date()
      exp.setTime(exp.getTime()+30*24*60*60*1000)
      document.cookie='laravel_session='+this.laravel_session+";expires=" + exp.toGMTString()
      // document.cookie='XSRF-TOKEN='+this.XSRF_TOKEN
      localStorage.setItem('cookie', JSON.stringify(this.laravel_session))
      console.log(document.cookie)
    }
  },
    mounted() {
    // this.clock()
    this.laravel_session = JSON.parse(localStorage.getItem('cookie')) || ''
  },
}
</script>

<style>
.form i{
  font-size: 20px;
  /* line-height: 18px; */
  text-align: center;
  margin-left: 2px;
}
.form i:hover {
  color: #5cb6ff;
}
</style>