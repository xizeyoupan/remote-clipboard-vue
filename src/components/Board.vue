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

    <div class="clip" v-for="e in data" :key="e.builtTime">
      <el-row :gutter="20">
        <el-col :span="20">
          <div>
            <el-input v-if="e.contentType==='text/plain'"
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                      :value="ab2str(e.buffer)"
                      @input="i=>insertStr2ab(e,i)">
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-button icon="el-icon-refresh" circle></el-button>
            <el-button type="warning" icon="el-icon-delete" circle></el-button>
            <el-button
                :type="show_btn_type(e).type"
                :icon="show_btn_type(e).icon"
                @click="toggle_btn_type(e)"
                circle></el-button>
            <el-button
                type="primary"
                icon="el-icon-copy-document"
                circle></el-button>
          </div>
        </el-col>
      </el-row>
    </div>

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
export default {
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
    insertStr2ab(e, str) {
      e.buffer = this.str2ab(str);
    },

    ab2str(ab) {
      return new TextDecoder().decode(ab);
    },

    str2ab(str) {
      return new TextEncoder().encode(str).buffer;
    },

    sync_clips() {
      console.log("update")
    },

    show_btn_type(e) {
      let res = {};
      if (e.blocked === "released") {
        res.type = "info";
        res.icon = "el-icon-unlock";
      } else {
        res.type = "success";
        res.icon = "el-icon-lock";
      }

      return res;
    },

    toggle_btn_type(e) {
      if (e.blocked === "released") {
        this.$set(e, "blocked", "blocked");
      } else {
        this.$set(e, "blocked", "released");
      }
    },

    async upload_files() {

    },

    async upload_text_or_img() {
      const clipboardItems = await navigator.clipboard.read();
      let new_clip = {};
      for (const clipboardItem of clipboardItems) {
        let is_img = false;

        for (const type of clipboardItem.types) {
          if (type.includes("image")) {
            is_img = true;
            new_clip.buffer = await (await clipboardItem.getType(type)).arrayBuffer();
            new_clip.contentType = type;
            break;
          }
        }
        if (is_img) {
        } else if (clipboardItem.types.includes("text/plain")) {
          new_clip.contentType = "text/plain";
          let clip_text = await (await clipboardItem.getType("text/plain")).text();
          new_clip.buffer = this.str2ab(clip_text);
        } else {
          // console.log(clipboardItem)
          this.$message.error("该类型不支持粘贴上传，请上传文件(*￣3￣)╭");
          return;
        }

        new_clip.blocked = "released";
        new_clip.username = sessionStorage.getItem("username");
        new_clip.builtTime = new Date().getTime();
        new_clip.changeTime = new Date().getTime();

        this.data.push(new_clip);

      }
    }
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
