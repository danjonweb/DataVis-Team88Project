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
    <transition name="expand">
      <div v-if="weatherExpand" class="weather-holder menu-background">
        <div v-if="simple">
          <div class="read-out">
            <b-input-group class="toggle-weather" prepend="Enable">
              <b-input-group-prepend is-text>
                <input
                  type="checkbox"
                  :checked="weatherControlOn"
                  v-on:change="idealChange()"
                  aria-label="Checkbox for following text input"
                >
              </b-input-group-prepend>
            </b-input-group>
            <p :hidden="!weatherControlOn">Temp-Low: {{low}} Temp-High: {{high}}</p>
            <p :hidden="!weatherControlOn">Precip-Low: {{precipLow}} Precip-High: {{precipHigh}}</p>
          </div>

          <b-button-group class="weather-buttons">
            <b-button
              :disabled="!weatherControlOn"
              @click="setTempRange([simpleTempRanges.lowLow, simpleTempRanges.lowHigh])"
              variant="outline-primary"
            >Cool</b-button>
            <b-button
              :disabled="!weatherControlOn"
              @click="setTempRange([simpleTempRanges.midLow, simpleTempRanges.midHigh])"
              variant="outline-secondary"
            >Mild</b-button>
            <b-button
              :disabled="!weatherControlOn"
              @click="setTempRange([simpleTempRanges.highLow, simpleTempRanges.highHigh])"
              variant="outline-danger"
            >Warm</b-button>
          </b-button-group>

          <b-button-group class="weather-buttons">
            <b-button
              :disabled="!weatherControlOn"
              @click="setPrecipRange([simplePrecipRanges.dryLow, simplePrecipRanges.dryHigh])"
              variant="outline-danger"
            >Dry</b-button>
            <b-button
              :disabled="!weatherControlOn"
              @click="setPrecipRange([simplePrecipRanges.avgLow, simplePrecipRanges.avgHigh])"
              variant="outline-success"
            >Average</b-button>
            <b-button
              :disabled="!weatherControlOn"
              @click="setPrecipRange([simplePrecipRanges.wetLow, simplePrecipRanges.wetHigh])"
              variant="outline-primary"
            >Wet</b-button>
          </b-button-group>

          <div class="simp-adv-toggle">
            <b-button @click="setAdvanced">Advanced Selection</b-button>
          </div>
        </div>
        <div v-else>
          <b-input-group class="temp-box">
            <b-input-group-text slot="prepend" class="pre-tag">Ideal Temp (F)</b-input-group-text>

            <b-input-group-prepend is-text>
              <input
                type="checkbox"
                :checked="weatherControlOn"
                v-on:change="idealChange()"
                aria-label="Checkbox for following text input"
              >
            </b-input-group-prepend>
            <b-form-input
              type="number"
              :disabled="!weatherControlOn"
              :value="idealTemp"
              v-on:change="setTempIdeal($event)"
              aria-label="Text input with checkbox"
            />
          </b-input-group>

          <b-input-group class="temp-box">
            <b-input-group-text slot="prepend" class="pre-tag">+/- Tolerance (F)</b-input-group-text>

            <b-form-input
              type="number"
              :disabled="!weatherControlOn"
              :value="tempTol"
              v-on:change="setTempTol($event)"
              aria-label="Text input with checkbox"
            />
          </b-input-group>

          <b-input-group class="temp-box">
            <b-input-group-text slot="prepend" class="pre-tag">Ideal Precip (in)</b-input-group-text>

            <b-input-group-prepend is-text>
              <input
                type="checkbox"
                :checked="weatherControlOn"
                v-on:change="idealChange()"
                aria-label="Checkbox for following text input"
              >
            </b-input-group-prepend>
            <b-form-input
              type="number"
              :disabled="!weatherControlOn"
              :value="idealPrecip"
              v-on:change="setPrecipIdeal($event)"
              aria-label="Text input with checkbox"
            />
          </b-input-group>

          <b-input-group class="temp-box">
            <b-input-group-text slot="prepend" class="pre-tag">+/- Tolerance (in)</b-input-group-text>

            <b-form-input
              type="number"
              :disabled="!weatherControlOn"
              :value="precipTol"
              v-on:change="setPrecipTol($event)"
              aria-label="Text input with checkbox"
            />
          </b-input-group>
          <b-button class="simp-adv-toggle" @click="setAdvanced">Simple Selection</b-button>
        </div>
      </div>
    </transition>
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
      weatherControlOn: this.$store.state.weatherControlOn,
      tempTol: 15,
      idealTemp: 72,
      precipTol: 10,
      idealPrecip: 45,
      expanded: false,
      simple: true,
      simpleTempRanges: this.$store.state.simpleTempRanges,
      simplePrecipRanges: this.$store.state.simplePrecipRanges,
      low: 50,
      high: 77,
      precipLow: 3,
      precipHigh: 25
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    idealChange() {
      this.weatherControlOn = !this.weatherControlOn;
      this.$store.dispatch("setEnableWeather", this.weatherControlOn);
    },
    expand() {
      this.exapnded = this.weatherExpand;
      this.$emit("expanded", [!this.expanded]);
    },
    setAdvanced() {
      this.simple = !this.simple;
    },

    setTempTol(e) {
      this.tempTol = e;
      this.setTempRange([
        parseInt(this.idealTemp) - parseInt(this.tempTol),
        parseInt(this.idealTemp) + parseInt(this.tempTol)
      ]);
    },
    setPrecipTol(e) {
      this.precipTol = e;
      this.setPrecipRange([
        parseInt(this.idealPrecip) - parseInt(this.precipTol),
        parseInt(this.idealPrecip) + parseInt(this.precipTol)
      ]);
    },

    setTempIdeal(e) {
      this.idealTemp = e;
      this.setTempRange([
        parseInt(this.idealTemp) - parseInt(this.tempTol),
        parseInt(this.idealTemp) + parseInt(this.tempTol)
      ]);
    },
    setPrecipIdeal(e) {
      this.idealPrecip = e;
      this.setPrecipRange([
        parseInt(this.idealPrecip) - parseInt(this.precipTol),
        parseInt(this.idealPrecip) + parseInt(this.precipTol)
      ]);
    },

    setTempRange(tempRange) {
      this.low = tempRange[0];
      this.high = tempRange[1];
      this.$store.dispatch("setUserTempRange", {
        low: tempRange[0],
        high: tempRange[1]
      });
    },
    setPrecipRange(precipRange) {
      this.precipLow = precipRange[0];
      this.precipHigh = precipRange[1];
      this.$store.dispatch("setUserPercipRange", {
        low: precipRange[0],
        high: precipRange[1]
      });
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.weather-holder {
  padding: 1vh 0 4vh 0;
  overflow: auto;
}

.toggle-weather {
  width: 80%;
  padding: 0;
  margin: 0 0 3vh 5px !important;
  margin-left: 5px;
  margin-bottom: 3vh;
}

.read-out {
  display: flex;
  font-size: calc(5px + 1vh);
  margin-right: 1vw;
}

.weather-buttons {
  width: 25vw;
  min-width: 280px;
  margin-bottom: 2vh;
}

.temp-box {
  margin: 1vh;
  margin-top: 0vh;
  width: 96%;
  font-size: 5px;
}

.pre-tag {
  width: 50vw;
}

.simp-adv-toggle {
  margin-top: 2vh;
}

@media (orientation: landscape), (min-width: 733px) {
  .pre-tag {
    width: 14vw;
  }
}
</style>