<template>
  <section class="explorer">
    <Team88Visual/>
    <div>
      <Team88ControlsHeader/>
      <Team88Controls/>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import Team88ControlsHeader from "@/components/Controls/ControlsHeader.vue";
import Team88Controls from "@/components/Controls/Controls.vue";
import Team88Visual from "@/components/Visualization.vue";

export default {
  name: "Team88Home",
  components: {
    Team88ControlsHeader,
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

@media (orientation: landscape), (min-width: 769px) {
  .explorer {
    height: 92vh;
    width: 100vw;
    background-color: rgb(204, 204, 204);
    display: flex;
  }
}
</style>

