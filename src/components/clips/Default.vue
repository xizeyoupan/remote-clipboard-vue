<template>
  <div class="container">
    <img class="pic" src="../../assets/file.svg" />
    <div>{{ clip.fileName }}</div>
  </div>
</template>

<script setup>
const props = defineProps(['clip']);
</script>

<style scoped>
.container {
  font-size: 1.25em;
  padding-bottom: 5px;
}

.pic {
  width: 80px;
}
</style>