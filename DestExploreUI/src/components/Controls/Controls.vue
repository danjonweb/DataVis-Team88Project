<template>
  <section class="sidebar">
    <Team88BudgetControls/>
    <Team88AvailabilityControls/>
    <Team88WeatherControls/>
    <Team88ActivityControls/>
    <Team88CulinaryControls/>
    <Team88CrimeControls/>
  </section>
</template>

<script>
// @ is an alias to /src
import Team88BudgetControls from "@/components/Controls/BudgetControls.vue";
import Team88AvailabilityControls from "@/components/Controls/AvailabilityControls.vue";
import Team88WeatherControls from "@/components/Controls/WeatherControls.vue";
import Team88ActivityControls from "@/components/Controls/ActivityControls.vue";
import Team88CulinaryControls from "@/components/Controls/CulinaryControls.vue";
import Team88CrimeControls from "@/components/Controls/CrimeControls.vue";

export default {
  name: "Team88Controls",
  components: {
    Team88BudgetControls,
    Team88AvailabilityControls,
    Team88WeatherControls,
    Team88ActivityControls,
    Team88CulinaryControls,
    Team88CrimeControls

  },
  data: function() {
    return {
      menus: this.$store.state.menus
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    clickbutton() {
      this.$store.dispatch("modCities");
    }
  }
};
</script>

<style scoped lang='scss'>

.sidebar {
  height: 35vh;
  width: 100vw;
  min-width: 300px;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  border: 1px solid #000;
  border-top: none;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

@media (orientation: landscape), (min-width: 769px) {
  .sidebar {
    height: 87vh;
    width: 30vw;
    min-width: 300px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #000;
    border-top: none;
  }
}

</style>

