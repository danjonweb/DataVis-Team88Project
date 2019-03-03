<template>
  <div id="app">

    <team88-header-banner class="header-fix"/>
    <team88-content-spacer/>

    <router-view/>

  </div>
</template>

<script>
import Team88HeaderBanner from "@/components/Header/HeaderBanner.vue";
import Team88ContentSpacer from "@/components/Header/ContentSpacer.vue";

export default {
  name: "App",
  components: {
    Team88ContentSpacer,
    Team88HeaderBanner
  }
};
</script>

<style lang="scss">
#app {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header-fix {
  position: fixed;
  top: 0;
  z-index: 3;
}
</style>
