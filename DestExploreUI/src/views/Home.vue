<template>
  <el-container>
    <Team88Visual/>
  </el-container>
</template>

<script>
// @ is an alias to /src

import Team88Visual from "@/components/Visualization.vue";

export default {
  name: "Team88Home",
  components: {
    Team88Visual
  },
  mounted() {
    this.$store.dispatch("showHideAboutAction", true);
  }
};
</script>

<style lang='scss'>

</style>

