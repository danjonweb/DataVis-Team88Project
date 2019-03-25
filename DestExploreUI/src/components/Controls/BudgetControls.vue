<template>
  <div >
    <div class="menu-header">
      <div class="menu-title-holder">
        <p class="title-text">Budget</p>
      </div>
      <div class="img-holder">
        <img :src="getImgUrl('budget.png')" class="my-card-img">
      </div>
    </div>
    <div v-if="true" class="budget-holder menu-background">
      <b-input-group class="budget-input" size="sm" prepend="Budget per Person">
        <b-input-group-prepend is-text>
          <b>$</b>
        </b-input-group-prepend>
        <b-form-input
          type="number"
          :value="budget"
          v-on:change="onChange($event)"
          aria-label="Text input with checkbox"
        />
      </b-input-group>
      <b-input-group prepend="0" append="5000" size="sm" class="mt-3 budget-slider">
        <b-form-input
          :value="budget"
          v-on:change="onChange($event)"
          type="range"
          min="0"
          max="5000"
        />
      </b-input-group>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88BudgetControls",
  components: {},
  data: function() {
    return {
      budget: 1000
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onChange(e) {
      this.budget = e;
      this.$store.dispatch("setBudgetAction", e);
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";

.budget-holder {
  height: 25vh;
  padding: 4vh 0 4vh 0;
  overflow: auto;
}

.budget-input {
  margin: 1vh;
  margin-top: 2vh;
  width: 96%;
  font-size: 5px;
}

.budget-slider {
  margin: 1vh;
  width: 96%;
}
</style>

