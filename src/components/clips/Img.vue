<template>
  <el-image ref="img" :src="ab2url(clip.buffer, clip.contentType)" fit="scale-down"></el-image>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { ab2url } from '../../utils/util';

const img = ref();
const props = defineProps(['clip']);

onBeforeUnmount(() => {
  const uri = img.value.src;
  URL.revokeObjectURL(uri)
})
</script>

<style scoped>

</style>