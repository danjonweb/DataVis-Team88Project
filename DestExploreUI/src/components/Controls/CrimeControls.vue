<template>
  <div>
    <div class="menu-header" :class="{active: !crimeExpand}" @click="expand">
      <div class="menu-title-holder" :class="{active: !crimeExpand}" @click="expand">
        <p class="title-text">Crime</p>
      </div>
      <div class="img-holder" :class="{active: !crimeExpand}" @click="expand">
        <img :src="getImgUrl('crime.png')" class="my-card-img">
      </div>
    </div>
    <transition name="expand">
      <div v-if="crimeExpand" class="crime-holder menu-background">
        <div class="mt-2 c-index">
          Max Crime Index:
          <strong>{{ crimeValue }}</strong>
        </div>
        <b-input-group size="sm" class="mt-3 crime-slider">
          <b-input-group-prepend>
            <b-button size="sm" class="no-hov" :variant="colorCode">0</b-button>
          </b-input-group-prepend>
          <b-form-input type="range" id="range-2" v-model="crimeValue" min="0" max="2000" step="200"/>
          <b-input-group-append>
            <b-button size="sm" class="no-hov" :variant="colorCode">2000</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88CrimeControls",
  components: {},
  props: {
    crimeExpand: Boolean
  },
  data: function() {
    return {
      crimeValue: this.$store.state.crimeRating,
      colorCode: "outline-success",
      expanded: false
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    expand() {
      this.exapnded = this.crimeExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  },
  watch: {
    crimeValue() {
      this.$store.dispatch("setCrimeRating", this.crimeValue);
      if (this.crimeValue >= 1600) {
        this.colorCode = "outline-dark";
      } else if (this.crimeValue < 1600 && this.crimeValue >= 800) {
        this.colorCode = "outline-primary";
      } else {
        this.colorCode = "outline-success";
      }
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.crime-holder {
  padding: 4vh 0 4vh 0;
  text-align: left;
  overflow: auto;
}

.c-index {
  margin: 1vh;
  width: 96%;
}

.crime-slider {
  margin: 1vh;
  width: 96%;
  overflow: auto;
}
.no-hov {
  pointer-events: none;
}
</style>