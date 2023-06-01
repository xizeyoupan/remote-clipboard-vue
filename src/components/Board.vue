<template>
  <div class="board_container">
    <el-button class="btn" type="info" @click="disconnect">断开连接</el-button>
    <vue-finder id='my_vuefinder' :url="backEndUrl" :max-file-size="maxFileSize" locale="zh_CN"></vue-finder>
  </div>
</template>

<script setup>

import { ref, reactive, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const backEndUrl = import.meta.env.VITE_API_BASE_URL + "/api/v1";
const maxFileSize = import.meta.env.VITE_API_MAX_FILE_SIZE;

const disconnect = async () => {
  document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  await proxy.$router.push("/login");
}

</script>

<style scoped>
.board_container {
  position: absolute;
  width: 80%;
  left: 10%;
  top: 100px;
}

.btn {
  margin-bottom: 20px;
}
</style>
