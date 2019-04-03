<template>
  <el-card>
    <Team88ControlsHeader/>
    <el-collapse v-model="activeName" accordion>
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
    </el-collapse>
  </el-card>
</template>

<script>
// @ is an alias to /src
import Team88ControlsHeader from "@/components/Controls/ControlsHeader.vue";
import Team88BudgetControls from "@/components/Controls/BudgetControls.vue";
import Team88AvailabilityControls from "@/components/Controls/AvailabilityControls.vue";
import Team88WeatherControls from "@/components/Controls/WeatherControls.vue";
import Team88ActivityControls from "@/components/Controls/ActivityControls.vue";
import Team88CulinaryControls from "@/components/Controls/CulinaryControls.vue";
import Team88CrimeControls from "@/components/Controls/CrimeControls.vue";

export default {
  name: "Team88Controls",
  components: {
    Team88ControlsHeader,
    Team88BudgetControls,
    Team88AvailabilityControls,
    Team88WeatherControls,
    Team88ActivityControls,
    Team88CulinaryControls,
    Team88CrimeControls
  },
  data: function() {
    return {
      activeName: "1",
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

</style>

