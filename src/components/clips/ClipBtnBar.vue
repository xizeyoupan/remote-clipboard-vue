<template>
  <el-button-group>

    <el-button
        type="warning"
        icon="el-icon-delete"
        @click="$emit('delete-clip',clip)"
        size="medium"
    >
    </el-button>

    <el-button
        :type="show_btn_type.type"
        :icon="show_btn_type.icon"
        @click="toggle_btn_type"
        size="medium"
    >
    </el-button>

    <el-button
        type="primary"
        icon="el-icon-copy-document"
        @click="$emit('copy-or-download',clip)"
        size="medium"
    >
    </el-button>

<!--    <el-button-->
<!--        icon="el-icon-refresh"-->
<!--        v-if="clip.contentType===`text/plain`"-->
<!--        size="medium"-->
<!--    >-->
<!--    </el-button>-->
  </el-button-group>
</template>

<script>

export default {
  name: "ClipBtnBar",
  props: ['clip'],
  computed: {
    show_btn_type() {
      let res = {};
      if (this.clip.blocked === "released") {
        res.type = "info";
        res.icon = "el-icon-unlock";
      } else {
        res.type = "success";
        res.icon = "el-icon-lock";
      }
      return res;
    },
  },
  methods: {
    toggle_btn_type() {
      if (this.clip.blocked === "released") {
        this.clip.blocked = "blocked";
      } else {
        this.clip.blocked = "released";
      }
    },
  }

}
</script>

<style scoped>

</style>