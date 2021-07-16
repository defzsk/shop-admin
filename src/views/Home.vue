<template>
    <el-container>
  <el-header>
    <div>商城管理系统</div>
    <el-button type="info" size="mini" @click="returnHome">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse? '64px':'200px'">
     <div>
       <i class="el-icon-s-fold icons" @click="handleCollapse"></i>
     </div>
      <el-menu
      background-color="#00FFFF"
      text-color="#fff"
      active-text-color="#CD5C5C"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
       :default-active="$route.path"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ' '" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item :index="'/'+ i.path" v-for="i in item.children" :key="i.id">
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{i.authName}}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import { getMenuList } from '@/api/user.js'
export default {
  name: 'home',
  components: {},
  props: {},
  data () {
    return {
      menuList: [],
      isCollapse: false
    }
  },

  computed: {},

  created () {
    this.loadGetMenuList()
  },

  mounted () {},

  methods: {
    async loadGetMenuList () {
      const menuList = await getMenuList()
      this.menuList = menuList.data.data
      // console.log(this.menuList)
    },
    handleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    returnHome () {
      this.$confirm('此操作将退出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },

  watch: {}

}

</script>
<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-header {
  background-color: #00CDCD;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    font-size: 24px;
    padding-left: 15px
   }
  .el-button {
    width: 50px;
    height: 30px;
  }
}
.el-aside {
  background-color:#00FFFF;
  div {
    height: 20px;
    .icons {
      float: right;
      font-size: 20px;
    }
  }
  // border-right 解决边框不齐问题
  .el-menu {
    border-right: none;
  }
}
</style>
