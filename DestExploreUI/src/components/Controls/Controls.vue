<template>
  <div class="control-background">
    <b-card class="sidebar" header-tag="header">
      <Team88UserLocationHeader class="inputLocation" slot="header"></Team88UserLocationHeader>
      <Team88BudgetControls
        :budgetExpand="menuSet.budget"
        v-on:expanded="expandMenu($event, 'budget')"
      />
      <Team88AvailabilityControls
        :availabilityExpand="menuSet.availability"
        v-on:expanded="expandMenu($event, 'availability')"
      />
      <Team88WeatherControls
        :weatherExpand="menuSet.weather"
        v-on:expanded="expandMenu($event, 'weather')"
      />
      <Team88ActivityControls
        :activityExpand="menuSet.activity"
        v-on:expanded="expandMenu($event, 'activity')"
      />
      <Team88CulinaryControls
        :culinaryExpand="menuSet.culinary"
        v-on:expanded="expandMenu($event, 'culinary')"
      />
      <Team88CrimeControls
        :crimeExpand="menuSet.crime"
        v-on:expanded="expandMenu($event, 'crime')"
      />
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import Team88UserLocationHeader from "@/components/Controls/UserLocationHeader";
import Team88BudgetControls from "@/components/Controls/BudgetControls.vue";
import Team88AvailabilityControls from "@/components/Controls/AvailabilityControls.vue";
import Team88WeatherControls from "@/components/Controls/WeatherControls.vue";
import Team88ActivityControls from "@/components/Controls/ActivityControls.vue";
import Team88CulinaryControls from "@/components/Controls/CulinaryControls.vue";
import Team88CrimeControls from "@/components/Controls/CrimeControls.vue";

export default {
  name: "Team88Controls",
  components: {
    Team88UserLocationHeader,
    Team88BudgetControls,
    Team88AvailabilityControls,
    Team88WeatherControls,
    Team88ActivityControls,
    Team88CulinaryControls,
    Team88CrimeControls
  },
  data: function() {
    return {
      menuSet: {
        budget: true,
        availability: false,
        weather: false,
        activity: false,
        culinary: false,
        crime: false
      }
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    expandMenu(setting, menu) {
      if (setting[0]) {
        var currentSet = this.menuSet;
        Object.keys(currentSet).forEach(function(key) {
          currentSet[key] = false;
        });
        currentSet[menu] = setting[0];
        this.menuSet = currentSet;
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.control-background {
  background-color: rgb(247, 247, 247);
}
.sidebar {
  height: 40vh;
  width: 100vw;
  min-width: 300px;
  overflow: none;
  -webkit-overflow-scrolling: touch;
}

.inputLocation {
  height: 13vh;
  margin: 2vh 0 0 1vw;
}

.card-header {
  padding: 0;
  margin: 0;
  height: 28vh;
  background-color: rgb(121, 129, 129);
  overflow: auto;
}

.card-body {
  padding: 0;
  overflow: auto;
}
@media (orientation: landscape), (min-width: 733px) {
  .sidebar {
    height: 85vh;
    width: 30vw;
    margin: 3vh 1vw 0 0;
    min-width: 300px;
    border: 1px solid rgb(150, 150, 150);
    overflow: auto;
    border-radius: 1.5vmin 1.5vmin 1.5vmin 1.5vmin;
    -webkit-box-shadow: 0px 1px 29px -6px rgba(71, 71, 71, 1);
    -moz-box-shadow: 0px 1px 29px -6px rgba(71, 71, 71, 1);
    box-shadow: 0px 1px 29px -6px rgba(71, 71, 71, 1);
  }
  .card-header {
    padding: 0;
    margin: 0;
    height: unset;
    background-color: rgb(121, 129, 129);
    overflow: auto;
  }
}
</style>

