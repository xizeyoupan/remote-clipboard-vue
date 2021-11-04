<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
if (process.env.NODE_ENV === "production") {
  if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
}

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
