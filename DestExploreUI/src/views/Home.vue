<template>
  <section class="explorer">
    <Team88Visual/>

    <Team88Controls/>
  </section>
</template>

<script>
// @ is an alias to /src

import Team88Controls from "@/components/Controls/Controls.vue";
import Team88Visual from "@/components/Visualization.vue";

export default {
  name: "Team88Home",
  components: {
    Team88Controls,
    Team88Visual
  },
  mounted() {
    this.$store.dispatch("showHideAboutAction", true);
  }
};
</script>

<style scoped lang='scss'>
.explorer {
  height: 92vh;
  width: 100vw;
}

@media (orientation: landscape), (min-width: 733px) {
  .explorer {
    height: 92vh;
    width: 100vw;
    display: flex;
  }
}
</style>

