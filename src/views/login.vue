<template>
  <div class="login-container">
     <div class="login-box">
       <div class= "title">商城后台管理系统</div>
        <el-form ref="form" :model="form" class="login-form" :rules="rules">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="form.password" placeholder="请输入密码" show-password ></el-input>
          </el-form-item>
          <el-form-item class="login-button">
            <el-button type="primary" @click="onSubmit" :loading="loading">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
     </div>
  </div>
</template>

<script>
import { login } from '@/api/user.js'
export default {
  name: 'login',
  components: {},
  props: {},
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ]
      },
      loading: false

    }
  },

  computed: {},

  created () {},

  mounted () {},

  methods: {
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 表单验证通过，发送登录请求
          this.login1()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login1 () {
      this.loading = true
      login(this.form).then((res) => {
        // 保存token到本地
        window.sessionStorage.setItem('token', res.data.data.token)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 跳转到指定页面
        setTimeout(() => this.$router.push('/home'), 2000)
        // 关闭load状态
        this.loading = false
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '登录失败',
          type: 'error'
        })
        this.loading = false
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  },

  watch: {}

}

</script>
<style scoped lang="less">
.login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:#2b4b6b;
    .login-box {
      width: 450px;
      height: 250px;
      position: relative;
      border-radius:5px;
      background-color: #fff;
      .login-form {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        .login-button {
          display: flex;
          justify-content: flex-end;
        }
      }
      .title {
        color: #3b5369;
        text-align: center;
        padding-top: 10px;
        font-size:20px;
      }
    }
}
</style>
