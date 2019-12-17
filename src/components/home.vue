<template>
  <div class="home_box">
    <el-container class="home_container">
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/img/logo.jpg" alt />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu background-color="#043d79" text-color="#fff" active-text-color="#ffd04b" :default-active="activePath" router unique-opened :collapse="isCollapse" :collapse-transition="false">
            <!-- 一级菜单 给每个菜单需要动态添加一个字符串（不相同） 来使其不一起开关-->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index=" '/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    // 最开始给 activePath 赋值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      // this.$http.get('menus') 是promise操作
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(this.menuList)
    },
    // 切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      // 保存导航链接激活状态
      window.sessionStorage.setItem('activePath', activePath)
      // 点击其他二级菜单时候赋值
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_box {
  height: 100%;
}
.home_container {
  height: 100%;
}
.el-header {
  background-color: #04468b;
  display: flex;
  justify-content: space-between;
  // padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
}
.el-aside {
  background-color: #043d79;
  .el-menu{
    border-right: 0;
  }
}
.toggle-button{
    background-color: #102c77;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
</style>
