<template>
  <el-image
      :key="`img`+this.clip.builtTime"
      :src="ab2url(this.clip.buffer,this.clip.contentType)"
      fit="scale-down"
  >
  </el-image>
</template>

<script>
import * as utils from '../../utils/util'

export default {

  props: ['clip'],
  name: "ClipImg",
  methods: {
    ab2url: utils.ab2url,
  }
}
</script>

<style scoped>

</style>