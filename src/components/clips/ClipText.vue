<template>
  <el-input type="textarea"
            autosize
            :value="ab2str(clip.buffer)"
            @input="i=>insertStr2ab(clip,i)">
  </el-input>
</template>

<script>
import * as utils from '../../utils/util'

export default {
  name: "ClipText",
  props: ['clip'],
  methods: {
    ab2str: utils.ab2str,
    insertStr2ab: utils.insertStr2ab,
  }
}
</script>

<style scoped>

</style>