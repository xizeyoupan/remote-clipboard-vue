<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/default_avatar.png" alt="" />
      </div>
      <!-- 表单区 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0" class="login_form">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="密钥" type="password"
            @keyup.enter.native="login(loginFormRef)"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-button-group class="login_btns">
          <el-button :disabled="loginBtnDisable" class="btn" type="primary" @click="login(loginFormRef)" plain>连接！
          </el-button>
          <el-button :disabled="registerBtnDisable" class="btn" type="info" plain @click="register(loginFormRef)">注册
          </el-button>
        </el-button-group>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

const loginFormRef = ref();
const loginBtnDisable = ref(false);
const registerBtnDisable = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = {
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
};

const login = async (formRef) => {
  await formRef.validate(async (valid, fields) => {
    if (!valid) return;
    try {
      loginBtnDisable.value = true;
      const res = await proxy.$http({ method: "POST", url: "/user", data: loginForm });
      await proxy.$router.push("/board");
      return ElMessage.success("登录成功！");
    } catch (error) {
      console.log(error)
      const msg = error.response.data.msg;
      return ElMessage.error(msg);
    } finally {
      loginBtnDisable.value = false;
    }
  }
  );
};

const register = async (formRef) => {
  await formRef.validate(async (valid, fields) => {
    if (!valid) return;
    try {
      registerBtnDisable.value = true;
      const res = await proxy.$http({ method: "POST", url: "/user/add", data: loginForm });
      return ElMessage.success("注册成功，可以登录o((>ω< ))o");
    } catch (error) {
      const msg = error.response.data.msg;
      return ElMessage.error(msg);
    } finally {
      registerBtnDisable.value = false;
    }
  }
  );
};


</script>

<style scoped>
.login_box {
  position: absolute;
  width: 50%;
  max-width: 500px;
  max-height: 280px;
  min-height: 230px;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.6);
}

.avatar_box {
  height: 100px;
  width: 100px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 0 5px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: rgba(238, 238, 238, 0.55);
  transition: All 0.8s ease-in-out;
}

.avatar_box img:hover {
  transform: rotate(360deg);
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
