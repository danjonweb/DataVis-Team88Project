<template>
  <div>
    <div class="menu-header" :class="{active: !weatherExpand}" @click="expand">
      <div class="menu-title-holder" :class="{active: !weatherExpand}" @click="expand">
        <p class="title-text">Weather</p>
      </div>
      <div class="img-holder" :class="{active: !weatherExpand}" @click="expand">
        <img :src="getImgUrl('weather.png')" class="my-card-img">
      </div>
    </div>
    <div v-if="weatherExpand" class="weather-holder menu-background">
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
  props: {
    weatherExpand: Boolean
  },
  data: function() {
    return {
      idealOn: false,
      tempTol: 15,
      idealTemp: 72,
      expanded: false
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
      if (!this.idealOn) {
        console.log("Temp Preference Off");
      } else {
        console.log("Min", this.minTemp, "Max", this.maxTemp);
      }
    },
    tempTolValueChange(e) {
      this.tempTol = parseInt(e);
      console.log("Min", this.minTemp, "Max", this.maxTemp);
    },
    idealTempValueChange(e) {
      this.idealTemp = parseInt(e);
      console.log("Min", this.minTemp, "Max", this.maxTemp);
    },
    expand() {
      this.exapnded = this.weatherExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.weather-holder {
  padding: 4vh 0 4vh 0;
  overflow: auto;
}
.temp-box {
  margin: 1vh;
  margin-top: 2vh;
  width: 96%;
  font-size: 5px;
}
.pre-tag {
  width: 50vw;
}

@media (orientation: landscape), (min-width: 733px) {
  .pre-tag {
    width: 14vw;
  }
}
</style>