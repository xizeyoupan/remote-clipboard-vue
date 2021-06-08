<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/default_avatar.png" alt="" />
      </div>
      <!-- 表单区 -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        label-width="0"
        class="login_form"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="板号"
            prefix-icon="el-icon-edit"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密钥"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_btns">
          <el-button class="btn" type="primary" @click="login" round plain
            >连接！</el-button
          >
          <el-button class="btn" type="info" round plain @click="toAbout"
            >关于</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入板子的大名！<(￣ c￣)y▂ξ",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "你不要密码了是罢😅😅😅",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/user", this.loginForm);
        console.log(res);
        if (res.code === -1) return this.$message.error(res.msg);
        return this.$message.success(res.msg);
      });
    },

    toAbout() {
      window.open("https://blog.2333332.xyz/2021/02/16/remote-clipboard");
    },
  },
};
</script>

<style lang="less" scoped>
.login_box {
  position: absolute;
  width: 50%;
  max-width: 500px;
  max-height: 280px;
  min-height: 230px;
  border-radius: 5px;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.6);

  .avatar_box {
    height: 100px;
    width: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0, 0, 5px, #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      height: 100%;
      width: 100;
      border-radius: 50%;
      background-color: rgba(238, 238, 238, 0.55);
      transition: All 0.8s ease-in-out;
    }

    img:hover {
      transform: rotate(360deg);
    }
  }
}

.login_form {
  padding-top: 60px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.login_btns {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>