<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <div>
        <component :is="Component" />
      </div>
    </suspense>
  </router-view>
</template>


<script setup>
</script>