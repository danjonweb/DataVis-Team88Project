<template>
  <div>
    <div class="menu-header" :class="{active: !budgetExpand}" @click="expand">
      <div class="menu-title-holder" :class="{active: !budgetExpand}" @click="expand">
        <p class="title-text">Budget</p>
      </div>
      <div class="img-holder" :class="{active: !budgetExpand}" @click="expand">
        <img :src="getImgUrl('budget.png')" class="my-card-img">
      </div>
    </div>
    <transition name="expand">
      <div v-if="budgetExpand" class="budget-holder menu-background">
        <b-input-group class="budget-input" prepend="Budget per Person">
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
        <b-input-group prepend="0" append="5000" class="mt-3 budget-slider">
          <b-form-input
            :value="budget"
            v-on:change="onChange($event)"
            type="range"
            min="0"
            max="5000"
          />
        </b-input-group>
        <b-input-group class="toggle-airline" prepend="Disable Airline Travel">
          <b-input-group-prepend is-text>
            <input
              type="checkbox"
              :checked="airlineDisable"
              v-on:change="airDisableChange()"
              aria-label="Checkbox for following text input"
            >
          </b-input-group-prepend>
        </b-input-group>
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88BudgetControls",
  components: {},
  props: {
    budgetExpand: Boolean
  },
  data: function() {
    return {
      budget: 1000,
      expanded: true,
      airlineDisable: false
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onChange(e) {
      this.budget = e;
      this.$store.dispatch("setBudgetAction", e);
    },
    expand() {
      this.expanded = this.budgetExpand;
      this.$emit("expanded", [!this.expanded]);
    },
    airDisableChange() {
      this.airlineDisable = !this.airlineDisable;
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";

.budget-holder {
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

.toggle-airline {
  margin: 1vh;
  margin-top: 2vh;
  width: 25vw;
}
</style>

