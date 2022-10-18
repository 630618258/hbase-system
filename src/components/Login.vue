<template>
  <div class="login">
    <div class="card">
      <h1>Hbase数据管理系统</h1>
      <div class="form">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item prop="email" label="邮箱">
            <el-col :span="14">
              <el-input v-model="loginForm.email"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button
                :disabled="isDisabled"
                type="success"
                ref="btn"
                @click="emailSubmit"
                >{{ btnText }}</el-button
              >
            </el-col>
          </el-form-item>
          <el-form-item prop="code" label="验证码">
            <el-col :span="8">
              <el-input v-model="loginForm.code"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="12">
            <el-button @click="formSubmit" type="primary">登录</el-button>
          </el-col>
          <el-col :span="12">
            <el-tag type="info">没有账号会自动注册</el-tag>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateEmail = (rule, val, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

      var result = regEmail.test(val);

      if (result) {
        return callback();
      }

      callback(new Error("请输入正确格式的邮箱"));
    };

    return {
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        code: [
          { min: 6, max: 6, message: "请输入六位数验证码", trigger: "blur" },
        ],
      },
      loginForm: {
        email: "",
        code: "",
      },
      countdown: 60,
      isDisabled: false,
      btnText: "获取验证码",
    };
  },
  methods: {
    emailSubmit() {
      var that = this;

      this.posts("/api/user/sendCode", {
        email: that.loginForm.email,
      }).then(function (response) {
        if (response.data.status.code === 200) {
          that.$message.success("发送成功");
          that.countDown();
        }
      });
    },
    formSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return;

        var that = this;
        this.posts("/api/user/login", {
          email: this.loginForm.email,
          code: this.loginForm.code,
        }).then(function (res) {
          if (res.data.status.code === 200) {
            localStorage.setItem("token", res.data.data.token);
            that.$message.success("登录成功，跳转中....................");
            setTimeout(function () {
              that.$router.push("/main");
            }, 2000);
          } else {
            that.$message.error("登录失败");
          }
        });
      });
    },
    countDown() {
      // var btn = this.$refs.btn;
      var id;
      var that = this;
      if (that.countdown) {
        that.isDisabled = true;
        that.btnText = that.countdown + " 秒";
        that.countdown--;
        id = setTimeout(that.countDown, 1000);
      } else {
        that.isDisabled = false;
        that.btnText = "获取验证码";
        that.countdown = 60;
        clearTimeout(id);
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/index.webp");
  background-repeat: no-repeat;
  background-size: cover;
}

.card {
  align-items: center;
  width: 600px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  /* box-shadow: 1px 1px 1px 1px; */
}

.card {
  text-align: center;
}

h1 {
  margin-top: 30px;
  margin-bottom: 50px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form .el-form .el-form-item:first-child .el-col:first-child {
  margin-right: 20px;
}

/* .el-card  {
  width: 600px;
  height: 400px;
}

.el-card >>> .el-card__header {
  text-align: center;
}

.el-card >>> .el-card__body {
  display: flex;
  justify-content: center;
  padding-top: 45px;
}

.el-input {
  width: 300px;
} */

/* .btn {
  border: none;
  padding: 15px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
} */
</style>