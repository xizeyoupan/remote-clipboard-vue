<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="20">
        <div style="text-align: center">
          <clip-text :clip="clip" v-if="clip.contentType==='text/plain'"></clip-text>
          <clip-img :clip="clip" v-else-if="clip.contentType.includes('image')"></clip-img>
          <clip-file :clip="clip" v-else></clip-file>
        </div>
      </el-col>
      <el-col :span="4">
        <clip-btn-bar :clip="clip" v-on="$listeners"></clip-btn-bar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ClipBtnBar from "@/components/clips/ClipBtnBar";
import ClipText from "@/components/clips/ClipText";
import ClipFile from "@/components/clips/ClipFile";
import ClipImg from "@/components/clips/ClipImg";

export default {
  name: "ClipDiv",
  components: {ClipBtnBar, ClipFile, ClipImg, ClipText},
  props: ['clip'],

}
</script>

<style scoped>

</style>