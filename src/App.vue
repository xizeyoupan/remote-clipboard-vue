<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import trianglify from "trianglify";

export default {
  name: "app",
  created: function () {
    const pattern = trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const canvas = pattern.toCanvas();
    canvas.id = "lowpoly";
    document.body.appendChild(canvas);
  },
};
</script>

<style lang="less" scoped>

</style>
