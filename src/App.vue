<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <suspense>
        <div>
          <component :is="Component" />
        </div>
      </suspense>
    </router-view>
  </div>
</template>


<script setup>
</script>