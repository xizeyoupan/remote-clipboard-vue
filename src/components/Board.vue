<template>
  <div class="board_container">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div>
            <el-button-group>
              <el-button type="warning" @click="delete_all">删除全部</el-button>
              <el-button type="danger" @click="disconnect">退出登录</el-button>
            </el-button-group>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span>共有{{ clips.length }}条clip(s).</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-for="(clip, index) in clips" :key="index">
      <el-row class="container" :gutter="20">
        <el-col :span="20">
          <div class="clip-with-progress">
            <component :clip="clip" :is="contentType2ClipComponents(clip)" />
            <el-progress :percentage="clip.progress.percentage" :status="clip.progress.status" />
          </div>
        </el-col>
        <el-col :span="4">
          <el-button-group class="btn-group">
            <el-button type="warning" @click="delete_clip(clip)">删除</el-button>
            <el-button :type="clip.status == 1 ? 'info' : 'success'" @click="change_block_status(clip)">
              {{ clip.status == 1 ? '未锁定' : '锁定' }}
            </el-button>
            <el-button type="primary" @click="copy_or_download(clip)">保存</el-button>

          </el-button-group>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <el-col :span="20">
        <el-input type="textarea" autosize placeholder="请输入内容或直接按旁边的粘贴按钮(*￣3￣)╭" v-model="new_clip_text"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button-group>
          <el-button @click="upload_from_input">完成</el-button>
          <el-button type="info" @click="upload_from_clipboard">复制</el-button>
          <el-button type="primary" @click="$refs.uploadHiddenInput.click()">选择</el-button>
          <input ref="uploadHiddenInput" type="file" multiple @change="upload_files" style="display: none" />
        </el-button-group>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ab2str, gen_clip, str2ab, upload_text_or_img, contentType2ClipComponents } from "../utils/util"
import { upload_to_oss, download_from_oss, delete_from_oss, batch_delete_from_oss } from "../file-manager/ucloud-manager"

const { proxy } = getCurrentInstance();
let new_clip_text = ref('');
const clips = ref([]);

let res = await proxy.$http({ method: "GET", url: "/clip" });
clips.value = res.data.data;

res = await proxy.$http({ method: "GET", url: "/user/config" });
const config = res.data.data;

clips.value.map(async (clip) => {
  clip.progress = { status: '', percentage: 0 };

  if (clip.contentType.startsWith("text") || clip.contentType.startsWith("image")) {
    download_from_oss(config, clip, (success) => {
      success.arrayBuffer().then(buffer => {
        clip.buffer = buffer;
        clip.progress = { status: 'success', percentage: 100 };
      })
    }, (error) => { }, (progress) => {
      clip.progress.percentage = Math.round(progress * 100);
    });
  }
})

const upload_from_input = () => {
  if (new_clip_text.value) {
    const clip = reactive(gen_clip(str2ab(new_clip_text.value), 'text/plain', `textByInput.txt`));
    clips.value.push(clip);
    upload(clip);
    new_clip_text.value = "";
  } else {
    proxy.$message.info(`先在文本框里输入什么东西plz❕`);
  }
}

const upload = async (clip) => {
  upload_to_oss(config, clip, async (success) => {
    proxy.$message.success("上传到OSS成功");
    const clip_info = Object.assign({}, clip);
    delete clip_info.buffer;
    try {
      const resp = await proxy.$http({ method: "POST", url: "/clip/add", data: clip_info });
      clip.progress.percentage = 100;
      clip.progress.status = "success";
      proxy.$message.success("上传到数据库成功😘");
    } catch (error) {
      console.error(error);
      proxy.$message.error(error.response.data.msg);
    }
  }, (error) => {
    proxy.$message.error("上传到oss失败了0.0");
    console.error(error);
  }, (progress) => {
    clip.progress.percentage = Math.round(progress * 100);
  })
}


const upload_from_clipboard = async () => {
  let clip = await upload_text_or_img(() => {
    proxy.$message.error("该类型不支持粘贴上传，请上传文件(*￣3￣)╭");
  });
  if (clip) {
    clip = reactive(clip);
    clips.value.push(clip);
    upload(clip);
  }
}

const delete_clip = (clip) => {

  delete_from_oss(config, clip, async (success) => {
    try {
      const resp = await proxy.$http({ method: "POST", url: "/clip/delete", data: clip });
      clips.value = clips.value.filter((i) => {
        return i.uuid != clip.uuid;
      });
      proxy.$message.success('删除成功（￣︶￣）↗　');
    } catch (error) {
      console.error(error);
      proxy.$message.error(error.response.data.msg);
    }
  }, (error) => {
    proxy.$message.success('OSS删除失败');
    console.error(error);
  })
}

const copy_or_download = async (clip) => {
  try {
    if (clip.contentType.startsWith('text')) {
      await navigator.clipboard.writeText(ab2str(clip.buffer));
      proxy.$message.success(`复制文本成功❤`);

    } else if (clip.contentType.startsWith('image')) {
      const blob = new Blob([clip.buffer], { type: clip.contentType });
      const item = new ClipboardItem({ [clip.contentType]: blob });
      await navigator.clipboard.write([item]);
      proxy.$message.success(`复制图片成功💙`);
    } else {
      clip.progress = { status: '', percentage: 0 };

      download_from_oss(config, clip, (success) => {
        success.arrayBuffer().then(buffer => {
          clip.buffer = buffer;
          clip.progress = { status: 'success', percentage: 100 };

          const blob = new Blob([buffer], { type: clip.contentType });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = clip.fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        })
      }, (error) => { }, (progress) => {
        clip.progress.percentage = Math.round(progress * 100);
      });
    }
  } catch (e) {
    console.error(e);
  }
}

const upload_files = (event) => {
  if (event.target.files.length) {
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const clip = reactive(gen_clip(result, file.type, file.name))
        clips.value.push(clip);
        upload(clip);
      }
      reader.readAsArrayBuffer(file);
    };
  }
}

const update = async (clip) => {
  try {
    const resp = await proxy.$http({ method: "POST", url: "/clip/update", data: clip });
    proxy.$message.success("更新成功😍");
  } catch (error) {
    console.error(error);
    proxy.$message.error(error.response.data.msg);
  }
}

const change_block_status = async (clip) => {
  if (clip.status == 1) {
    clip.status = 2;
  } else if (clip.status == 2) {
    clip.status = 1;
  }
  await update(clip);
}


const delete_all = async () => {
  const delete_list = clips.value.filter((i) => {
    return i.status == 1;
  });

  if (delete_list.length === 0) {
    proxy.$message.info("没有未锁定的clip来删除");
    return;
  }

  batch_delete_from_oss(config, delete_list, async (success) => {
    try {
      const resp = await proxy.$http({ method: "GET", url: "/clip/delete/all" });
      clips.value = clips.value.filter((i) => {
        return i.status == 2;
      });
      proxy.$message.success("删除成功");
    } catch (error) {
      console.error(error);
      proxy.$message.error(error.response.data.msg);
    }
  }, (error) => {
    proxy.$message.success('OSS删除失败');
    console.error(error);
  })
}

const disconnect = async () => {
  document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  await proxy.$router.push("/login");
}


</script>

<style scoped>
.board_container {
  position: absolute;
  width: 84%;
  left: 8%;
  top: 50px;
}

.header {
  margin-bottom: 25px;
}

.clip-with-progress {
  text-align: center;
  margin-bottom: 10px;
}

.btn-group {
  margin-bottom: 10px;
}

.container {
  align-items: center;
}
</style>
