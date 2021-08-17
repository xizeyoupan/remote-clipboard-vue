<template>
  <span>
    <i class="el-icon-document" style="display: block;font-size: 48px;margin-bottom: 5px"></i>
    <span class="icon-name" style="display: inline-block;font-size: 1.25em">{{ clip.fileName }}</span>
  </span>
</template>

<script>
export default {
  name: "ClipFile",
  props: ['clip']
}
</script>

<style scoped>

</style>