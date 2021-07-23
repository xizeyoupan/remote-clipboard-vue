<template>
  <div class="board_container">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div>
            <el-button type="warning">清除全部</el-button>
            <el-button type="danger">断开连接</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div>12</div>
        </el-col>
      </el-row>
    </div>

    <clip-div v-for="(clip,index) in data" :clip="clip" :key="index"></clip-div>

    <el-row :gutter="20">
      <el-col :span="20">
        <el-input
            class="clip"
            type="textarea"
            autosize
            placeholder="请输入内容或直接按旁边的粘贴按钮(*￣3￣)╭"
            v-model="new_clip_text"></el-input>
      </el-col>
      <el-col :span="4">
        <div>
          <el-button icon="el-icon-check" circle></el-button>
          <el-button
              @click="upload_text_or_img"
              type="info"
              icon="el-icon-paperclip"
              circle>
          </el-button>
          <el-button
              @click="upload_files"
              type="primary"
              icon="el-icon-upload2"
              circle>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ClipDiv from "@/components/clips/ClipDiv";
import * as utils from '../utils/util'

export default {
  components: {ClipDiv},
  created() {
    this.sync_clips();
    const timeout = 10000;
    this.timer_id = setInterval(this.sync_clips, timeout);
  },

  data() {
    return {
      timer_id: null,
      new_clip_text: ``,
      data: [],
    };
  },

  computed: {},

  methods: {

    async upload_text_or_img() {
      this.data.push(await utils.upload_text_or_img());
    },
    sync_clips() {
      console.log("update")
    },


    toggle_btn_type(e) {
      if (e.blocked === "released") {
        e.blocked = "blocked";
      } else {
        e.blocked = "released";
      }
    },

    scroll2end() {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    },

    async upload_files() {

    },


  },
};
</script>

<style lang="less" scoped>
.board_container {
  position: absolute;
  width: 84%;
  left: 8%;
  top: 50px;
}

.header {
  margin-bottom: 25px;
}

.clip {
  margin-bottom: 20px;
}
</style>
