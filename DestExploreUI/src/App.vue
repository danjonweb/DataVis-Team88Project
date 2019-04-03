<template>
  <el-container direction="vertical">
    <team88-header-banner/>
    <router-view/>
  </el-container>
</template>

<script>
import Team88HeaderBanner from "@/components/Header/HeaderBanner.vue";

export default {
  name: "App",
  components: {
    Team88HeaderBanner
  }
};
</script>

<style lang="scss">

</style>
