<template>
  <el-input type="textarea"
            autosize
            :value="ab2str(clip.buffer)"
  >
  </el-input>

</template>

<script>
const {ab2str} = require("@/utils/util");

export default {
  name: "ClipText",
  props: ['clip'],
  methods: {
    ab2str
  },


}
</script>

<style scoped>

</style>