<template>
  <div class="menu-hold">
    <div class="menu-header">
      <div class="menu-title-holder">
        <p class="title-text">Weather</p>
      </div>
      <div class="img-holder">
        <img :src="getImgUrl('weather.png')" class="my-card-img">
      </div>
    </div>
    <div class="content-holder">
      <b-input-group class="temp-box" size="sm">
        <b-input-group-text slot="prepend" class="pre-tag">Ideal Temp (F)</b-input-group-text>

        <b-input-group-prepend is-text>
          <input
            type="checkbox"
            :checked="idealOn"
            v-on:change="idealChange()"
            aria-label="Checkbox for following text input"
          >
        </b-input-group-prepend>
        <b-form-input
          type="number"
          :disabled="!idealOn"
          :value="idealTemp"
          v-on:change="idealTempValueChange($event)"
          aria-label="Text input with checkbox"
        />
      </b-input-group>

      <b-input-group class="temp-box" size="sm">
        <b-input-group-text slot="prepend" class="pre-tag">+/- Tolerance (F)</b-input-group-text>

        <b-form-input
          type="number"
          :disabled="!idealOn"
          :value="tempTol"
          v-on:change="tempTolValueChange($event)"
          aria-label="Text input with checkbox"
        />
      </b-input-group>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88WeatherControls",
  components: {},
  data: function() {
    return {
      idealOn: false,
      tempTol: 15,
      idealTemp: 72
    };
  },
  computed: {
    // a computed getter
    minTemp: function() {
      return this.idealTemp - this.tempTol;
    },
    maxTemp: function() {
      return this.idealTemp + this.tempTol;
    }
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    idealChange() {
      this.idealOn = !this.idealOn;
      if (!this.idealOn){
        console.log('Temp Preference Off')
      }else{
        console.log("Min",this.minTemp, "Max",this.maxTemp);
      }
      
    },
    tempTolValueChange(e) {
      this.tempTol = parseInt(e);
      console.log("Min",this.minTemp, "Max",this.maxTemp);
    },
    idealTempValueChange(e) {
      this.idealTemp = parseInt(e);
      console.log("Min",this.minTemp, "Max",this.maxTemp);
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.temp-box {
  margin: 1vh;
  margin-top: 2vh;
  width: 96%;
  font-size: 5px;
}
.pre-tag {
  width: 50vw;
}

@media (orientation: landscape), (min-width: 769px) {
  .pre-tag {
    width: 14vw;
  }
}
</style>