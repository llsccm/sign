<template>
  <el-form :model="postBody" label-position="left" size="mini" label-width="40px" style="width: 600px">
    <el-form-item label="song" prop="song">
      <el-input v-model.trim="postBody.song" clearable></el-input>
    </el-form-item>
    <el-form-item label="msg" prop="msg">
      <el-input v-model="postBody.msg" @blur="postBody.msg = $event.target.value.trim()" autocomplete="off" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Msg',
  data() {
    return {
      postBody: {
        song: '',
        msg: ''
      }
    }
  },
  methods: {
    submitForm() {
      const { song, msg } = this.postBody
      const url = '/song/set'
      let options = {}
      options.headers = {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'content-type': 'application/json;charset=UTF-8'
      }
      options.method = 'POST'
      options.body = JSON.stringify({
        song,
        msg
      })
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
    }
  }
}
</script>

<style></style>
