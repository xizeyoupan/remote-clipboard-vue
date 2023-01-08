<template>
  <el-input type="textarea" autosize readonly :value="ab2str(props.clip.buffer)"></el-input>
</template>

<script setup>
import { ab2str } from "../../utils/util";
const props = defineProps(['clip']);

</script>

<style scoped>

</style>