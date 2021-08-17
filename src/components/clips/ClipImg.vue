<template>
  <el-image
      :key="`img`+clip.modifyTime"
      :src="ab2url(clip.buffer,clip.contentType)"
      fit="scale-down"
  >
  </el-image>
</template>

<script>
const {ab2url} = require("@/utils/util");

export default {

  props: ['clip'],
  name: "ClipImg",
  methods: {
    ab2url
  },
  beforeDestroy() {
    const uri = this.$el.querySelector('img').getAttribute('src');
    URL.revokeObjectURL(uri)
  }
}
</script>

<style scoped>

</style>