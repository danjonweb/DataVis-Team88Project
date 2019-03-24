<template>
  <div class="menu-hold">
    <div class="menu-header">
      <div class="menu-title-holder">
        <p class="title-text">Crime</p>
      </div>
      <div class="img-holder">
        <img :src="getImgUrl('crime.png')" class="my-card-img">
      </div>
    </div>
    <div class="crime-holder">
      <div class="mt-2">Risk Level: {{ crimeValue }}</div>
      <b-input-group size="sm" class="mt-3 crime-slider">
        <b-input-group-prepend>
          <b-button size="sm" class="no-hov" :variant="colorCode" >Very Safe</b-button>
        </b-input-group-prepend>
        <b-form-input
          type="range"
          id="range-2"
          v-model="crimeValue"
          min="0"
          max="5"
          step="0.5"
        />
        <b-input-group-append>
          <b-button size="sm" class="no-hov" :variant="colorCode">Some Risk</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88CrimeControls",
  components: {},
  data: function() {
    return {
      crimeValue: this.$store.state.crimeRating,
      colorCode: "outline-success"
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    }
  },
  watch: {
    crimeValue() {
      if (this.crimeValue >= 4.0) {
        this.colorCode = "outline-warning";
      } else if (this.crimeValue < 4.0 && this.crimeValue >= 2.0) {
        this.colorCode = "outline-info";
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
  overflow: auto;
  height: 75%;
}
.crime-slider {
  margin: 1vh;
  width: 96%;
  overflow: auto;
}
.no-hov{
  pointer-events: none;  
}


</style>