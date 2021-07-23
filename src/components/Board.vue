<template>
  <div class="board_container">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div>
            <el-button
                type="warning"
                @click="clear_all"
            >清除全部
            </el-button>

            <el-button type="danger">断开连接</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div><span>当前用户共有{{ data.length }}条clip(s).</span></div>
        </el-col>
      </el-row>
    </div>

    <clip-div
        class="clip"
        v-for="(clip,index) in data"
        :clip="clip"
        :key="index"
        @delete-clip="delete_clip">
    </clip-div>

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
              @click="$refs.uploadHiddenInput.click()"
              type="primary"
              icon="el-icon-upload2"
              circle>
          </el-button>
          <input ref="uploadHiddenInput" type="file" @change="upload_files" style="display: none;">
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
  watch: {},

  computed: {},

  methods: {

    async upload_text_or_img() {
      this.data.push(await utils.upload_text_or_img());
    },

    delete_clip(clip) {
      this.data = this.data.filter((item) => {
        return item.builtTime !== clip.builtTime;
      })
    },

    clear_all() {
      this.data = this.data.filter((item) => {
        return item.blocked === "blocked";
      })
    },


    sync_clips() {
      console.log("update");
    },

    upload_files(event) {
      // console.log(this.$refs.uploadHiddenInput.value)
      // console.log(Boolean(event.target.files), event.target.files)

      if (event.target.files.length) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          this.data.push(utils.gen_clip(result, file.type));

        }
        reader.readAsArrayBuffer(file);
      }


    },


  },
};
</script>

<style lang="less" scoped>

span {
  font-size: large;
  font-family: 'Helvetica Neue', 'Helvetica', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Arial', 'sans-serif';
}

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
