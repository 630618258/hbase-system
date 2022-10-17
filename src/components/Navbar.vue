<template>
  <div class="navbar">
    <div class="logo">
      <h1>Hbase数据资产管理系统</h1>
    </div>
    <div class="nav">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
      >
        <el-submenu index="1">
          <template slot="title">数据源</template>
          <el-menu-item @click="config" index="1-1">新建</el-menu-item>
          <el-menu-item @click="delSourcename" index="1-2">删除</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">命名空间</template>
          <el-menu-item @click="createNamespace" index="2-1">新建</el-menu-item>
          <el-menu-item @click="delNamespace" index="2-2">删除</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">表</template>
          <el-menu-item @click="createTable" index="3-1">新建</el-menu-item>
          <el-menu-item @click="delTable" index="3-2">删除</el-menu-item>
        </el-submenu>
        <el-menu-item @click="showBlackList" index="4">黑名单</el-menu-item>
        <el-menu-item @click="logout" style="float: right" index="4">登出</el-menu-item>
        <!-- <el-menu-item style="float: right" index="3">user</el-menu-item> -->
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 1,
    };
  },
  methods: {
    logout() {
      var that = this
      this.posts('/api/user/auth/logout').then(function(res) {
        if (res.data.status.code === 200) {
          localStorage.removeItem('token')
          that.$message.success('登出成功')
          that.$router.push('/login')
        } else {
          that.$message.error('登出失败')
        }
      })
    },
    handleSelect() {},
    createTable() {
      this.$parent.dialogCreateTableVisible = true
    },
    createNamespace() {
      this.$parent.dialogCreateNamespaceVisible = true
    },
    delTable() {
      this.$parent.dialogDeleteTableVisible = true
    },
    delNamespace() {
      this.$parent.dialogDeleteNamespaceVisible = true
    },
    delSourcename() {
      this.$parent.dialogDeleteSourcenameVisible = true
    },
    showBlackList() {
      this.$parent.getBlackList()
      this.$parent.dialogBlackListVisible = true
    },
    config() {
      this.$parent.dialogConfigVisible = true
    }
  },
};
</script>

<style>
.main-area {
  background-color: #545c64;
}

.main-area .menu {
  background-color: #545c64;
}

.navbar {
  display: flex;
  height: 75px;
}

.logo {
  text-align: center;
  width: 230px;
  background-color: rgb(233,235,236);
}
h1 {
  line-height: 75px;
  font-size: 16px;
}
.nav {
  flex: 1;
}

.nav .el-menu {
  height: 100%;
}

.nav .el-menu .el-submenu {
  height: 100%;
}

.nav .el-menu .el-submenu .el-submenu__title {
  line-height: 75px;
  height: 100%;
}

.nav .el-menu .el-menu-item {
  height: 100%;
  line-height: 75px;
}

.nav .el-menu .el-menu-item:last-child {
  margin-right: 40px;
}

</style>