<template>
  <div class="board_container">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div>
            <el-button-group>
              <el-button type="warning" @click="clear_all">清除全部</el-button>

              <el-button
                  type="danger"
                  @click="disconnect"
                  title="断开你的连接，同时清空这块板子的数据。注意，所有连接到这块板子的伙伴均会被踢下线！"
              >断开连接
              </el-button>
            </el-button-group>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span>当前用户共有{{ data.length }}条clip(s).</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <clip-div
        class="clip"
        v-for="(clip, index) in data"
        :clip="clip"
        :key="index"
        ref="clips"
        @delete-clip="delete_clip"
        @copy-or-download="copy_or_download(clip, index)"
    >
    </clip-div>

    <el-row :gutter="20">
      <el-col :span="20">
        <el-input
            class="clip"
            type="textarea"
            autosize
            placeholder="请输入内容或直接按旁边的粘贴按钮(*￣3￣)╭"
            v-model="new_clip_text"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button-group>
          <el-button icon="el-icon-check" size="medium" @click="gen_new_clip">
          </el-button>
          <el-button
              @click="upload_text_or_img"
              type="info"
              icon="el-icon-paperclip"
              size="medium"
          >
          </el-button>
          <el-button
              @click="$refs.uploadHiddenInput.click()"
              type="primary"
              icon="el-icon-upload2"
              size="medium"
          >
          </el-button>
          <input
              ref="uploadHiddenInput"
              type="file"
              @change="upload_files"
              style="display: none"
          />
        </el-button-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ClipDiv from "./clips/ClipDiv";
import {ab2str, gen_clip, str2ab, upload_text_or_img} from "../utils/util";

const EventSource = require('eventsource');
let es;


export default {
  components: {ClipDiv},

  // 进行sse连接
  created() {
    es = new EventSource(process.env.VUE_APP_API_BASE_URL + '/api/v1/connections/timeline', {
      headers: {
        'Authorization': "Bearer " + sessionStorage.getItem("token"),
      }
    });
    es.onmessage = (e) => {

      let clipList = JSON.parse(e.data);

      console.log(`clipList:`);
      console.log(clipList);

      const localUuids = this.data.map(clip => clip.uuid)
      // clipList = clipList.filter(clip => !localUuids.includes(clip.uuid)) // 过滤本地存在的clip，防止出现两个相同clip

      for (const clip of clipList) {
        if (clip.clipMode === "CREATED") {
          if (!localUuids.includes(clip.uuid)) this.data.push(clip);
        } else if ((clip.clipMode === "DELETED")) {
          this.data = this.data.filter(clip => clip.uuid !== clip.uuid)
        }
      }

    }
    es.onerror = err => {
      console.log("err here")
      console.log(err);
    }

  },

  data() {
    return {
      new_clip_text: ``,
      data: [],
    };
  },
  watch: {
    // 监听数组长度
    "data.length": async function (newValue, oldValue) {

      console.log(`newValue`, `oldValue`, newValue, oldValue)

      if (oldValue === 0 && newValue !== 1) { // oldValue 为 0 且 newValue !== 1 ，当后端 clips 不为零，浏览器刷新时
        for (const clip of this.data) {
          await this.download_buffer(clip);
        }
        return;
      }

      if (newValue <= oldValue) return;
      const clip = this.data[newValue - 1];

      console.log(`clip.buffer`);
      console.log(clip.buffer);

      if (clip.buffer) {
        // 上传文件
        this.upload_buffer(clip);
      } else {
        // 针对图像和文本下载arraybuffer
        await this.download_buffer(clip);
      }

    }
  },

  computed: {},

  methods: {

    upload_buffer(clip) {
      console.log(`list adds,uploading...`);

      let maxFileSize = process.env.VUE_APP_MAX_FILE_SIZE;
      maxFileSize = parseInt(maxFileSize.slice(0, -1))
      if (clip.buffer.byteLength > maxFileSize * 1024 * 1024) return this.$msgbox.alert(`逆大天，你的文件竟然超过了${maxFileSize}M!
      如果想传更大的，请！给！我！打！钱！`, {title: `上传失败！`, type: `error`});

      const blob = new Blob([clip.buffer], {type: clip.contentType});
      const formData = new FormData();

      formData.append("file", blob);
      formData.append('clip', new Blob([JSON.stringify(clip)], {type: "application/json"}));
      this.$http({method: "POST", url: "/file/upload", data: formData});
    },

    async download_buffer(clip) {
      if (!clip.contentType.includes('image') && clip.contentType !== 'text/plain') return;

      console.log(`list adds,downloading...`);

      const response = await this.$http({
        method: "POST",
        url: "/file/download",
        data: clip,
        responseType: `arraybuffer`
      });

      this.$set(clip, `buffer`, response.data);
    },

    gen_new_clip() {
      if (this.new_clip_text) {
        this.data.push(gen_clip(str2ab(this.new_clip_text), 'text/plain', `textByInput`));
        this.new_clip_text = ``;
      } else {
        this.$message.info(`先在文本框里输入什么东西plz❕`);
      }
    },

    async upload_text_or_img() {
      const clip = await upload_text_or_img(() => {
        this.$message.error("该类型不支持粘贴上传，请上传文件(*￣3￣)╭");
      });
      if (clip) this.data.push(clip);
    },

    delete_clip(clip) {
      this.data = this.data.filter((item) => {
        return item.modifyTime !== clip.modifyTime;
      })
    },

    clear_all() {
      this.data = this.data.filter((item) => {
        return item.blocked === "blocked";
      })
    },

    async disconnect() {
      es.close()
      await this.$http({method: "GET", url: "/connections/close"});
      sessionStorage.clear();
      await this.$router.push("/login");
    },

    async copy_or_download(clip, index) {
      try {
        if (clip.contentType === 'text/plain') {
          await navigator.clipboard.writeText(ab2str(clip.buffer));
          this.$message.success(`复制文本成功❤`);

        } else if (clip.contentType.includes('image')) {
          const uri = this.$refs.clips[index].$el.querySelector('img').getAttribute('src');
          const response = await fetch(uri);
          const blob = await response.blob();
          const item = new ClipboardItem({[clip.contentType]: blob});
          await navigator.clipboard.write([item]);
          this.$message.success(`复制图片成功💙`);

        } else {
          const axiosResponse = await this.$http({
            method: "POST",
            url: "/file/download",
            data: clip,
            responseType: `arraybuffer`
          });
          const blob = new Blob([axiosResponse.data], {type: clip.contentType});
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = clip.filename;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      } catch (e) {
        console.log(e);
      }

    },

    upload_files(event) {
      // console.log(this.$refs.uploadHiddenInput.value)
      // console.log(Boolean(event.target.files), event.target.files)

      if (event.target.files.length) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          this.data.push(gen_clip(result, file.type, file.name));

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
  font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB",
  "Microsoft YaHei", "微软雅黑", "Arial", "sans-serif";
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
