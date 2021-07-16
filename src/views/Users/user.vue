<template>
  <div class="">
   <!-- 面包屑路径导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card class="box-card">
  <!-- 卡片顶部搜索输入框 -->
  <el-row :gutter="15">
  <el-col :span="8">
    <el-input placeholder="请输入内容" v-model="query" clearable @clear="loadGetUserList">
    <el-button slot="append" icon="el-icon-search" @click="loadGetUserList"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
  </el-col>
</el-row>
<!-- 列表区域 -->
 <el-table
      :data="userList"
      style="width: 100%"
      border>
      <el-table-column
        prop="username"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
      label="状态"
     >
      <template slot-scope="scope">
        <el-switch
  v-model="scope.row.mg_state"
  @change="editUserStatus(scope.row.id, scope.row.mg_state)"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" circle  @click="handleEdit(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" enterable>
            <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
    </el-table>
</el-card>
<!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="clearForm">
  <el-form :model="form" :rules="rules" ref="form">
    <el-form-item label="用户名" with="50%" prop="username">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" with="50%" prop="password">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" with="50%" prop="email">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机" with="50%" prop="mobile">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleAddUser">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改用户资料弹出框 -->
<el-dialog title="修改用户资料" :visible.sync="dialogFormVisible2" @close="cleareditForm">
  <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
    <el-form-item label="用户名" prop="username" >
      <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱"  prop="email" >
      <el-input v-model="editForm.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile" >
      <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="handleEditUserInfo(editForm.id)">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import { getUserList, editUserStatus, addUser, getUserInfo, editUserInfo, removeUser } from '@/api/user.js'
export default {
  name: 'user',
  components: {},
  props: {},
  data () {
  // 验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        callback()
      }
      callback(new Error('请输入正确的邮箱地址'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const reg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      if (reg.test(value)) {
        callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      userList: [],
      total: 0,
      pagesize: 4,
      pagenum: 1,
      query: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {},

  created () {
    this.loadGetUserList()
  },

  mounted () {},

  methods: {
    async loadGetUserList () {
      const userList = await getUserList({
        query: this.query,
        pagesize: this.pagesize,
        pagenum: this.pagenum
      })
      // console.log(userList)
      this.userList = userList.data.data.users
      this.total = userList.data.data.total
    },
    async handleEdit (id) {
      this.dialogFormVisible2 = true
      const res = await getUserInfo(id)
      if (res.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data.data
      console.log(res)
    },
    handleDelete (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.loadGetUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (newPagesize) {
      this.pagesize = newPagesize
      this.loadGetUserList()
    },
    handleCurrentChange (newPagenum) {
      this.pagenum = newPagenum
      this.loadGetUserList()
    },
    async editUserStatus (id, state) {
      const res = await editUserStatus(id, state)
      if (res.data.meta.status !== 200) {
        state = !state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
      console.log(res)
    },
    clearForm () {
      this.$refs.form.resetFields()
    },
    cleareditForm () {
      this.$refs.editForm.resetFields()
    },
    handleAddUser () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 添加用户
          addUser(this.form).then(() => {
            this.loadGetUserList()
            this.$message({
              message: '添加用户成功成功',
              type: 'success'
            })
            this.dialogFormVisible = false
          }).catch(() => {
            this.$message({
              message: '添加用户失败',
              type: 'warning'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEditUserInfo (id) {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 修改用户资料
          editUserInfo(id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }).then((res) => {
            console.log(res)
            this.loadGetUserList()
            this.$message({
              message: '修改用户成功成功',
              type: 'success'
            })
            this.dialogFormVisible2 = false
          }).catch(() => {
            this.$message({
              message: '修改用户失败',
              type: 'warning'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },

  watch: {}

}

</script>
<style scoped lang="less">

</style>
