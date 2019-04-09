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
                  :checked="tempControlOn"
                  v-on:change="idealChange()"
                  aria-label="Checkbox for following text input"
                >
              </b-input-group-prepend>
            </b-input-group>
            <p :hidden="!tempControlOn">Low: {{low}} High: {{high}}</p>
          </div>

          <b-button-group class="weather-buttons">
            <b-button
              :disabled="!tempControlOn"
              @click="setTempRange([simpleTempRanges.lowLow, simpleTempRanges.lowHigh])"
              variant="outline-primary"
            >Cool</b-button>
            <b-button
              :disabled="!tempControlOn"
              @click="setTempRange([simpleTempRanges.midLow, simpleTempRanges.midHigh])"
              variant="outline-secondary"
            >Mild</b-button>
            <b-button
              :disabled="!tempControlOn"
              @click="setTempRange([simpleTempRanges.highLow, simpleTempRanges.highHigh])"
              variant="outline-danger"
            >Warm</b-button>
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
                :checked="tempControlOn"
                v-on:change="idealChange()"
                aria-label="Checkbox for following text input"
              >
            </b-input-group-prepend>
            <b-form-input
              type="number"
              :disabled="!tempControlOn"
              :value="idealTemp"
              v-on:change="setTempIdeal($event)"
              aria-label="Text input with checkbox"
            />
          </b-input-group>

          <b-input-group class="temp-box">
            <b-input-group-text slot="prepend" class="pre-tag">+/- Tolerance (F)</b-input-group-text>

            <b-form-input
              type="number"
              :disabled="!tempControlOn"
              :value="tempTol"
              v-on:change="setTempTol($event)"
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
      tempControlOn: this.$store.state.tempControlOn,
      tempTol: 15,
      idealTemp: 72,
      expanded: false,
      simple: true,
      simpleTempRanges: this.$store.state.simpleTempRanges,
      low: 51,
      high: 76
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    idealChange() {
      this.tempControlOn = !this.tempControlOn;
      this.$store.dispatch("setEnableWeather", this.tempControlOn);
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
    setTempIdeal(e) {
      this.idealTemp = e;
      this.setTempRange([
        parseInt(this.idealTemp) - parseInt(this.tempTol),
        parseInt(this.idealTemp) + parseInt(this.tempTol)
      ]);
    },
    setTempRange(tempRange) {
      this.low = tempRange[0];
      this.high = tempRange[1];
      this.$store.dispatch("setUserTempRange", {
        low: tempRange[0],
        high: tempRange[1]
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
  width: 95%;
  padding-top: 0;
  margin-left: 5px;
  margin-bottom: 3vh;
}

.read-out {
  display: flex;
}

.weather-buttons {
  width: 25vw;
  min-width: 280px;
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
  margin-top: 4vh;
}

@media (orientation: landscape), (min-width: 733px) {
  .pre-tag {
    width: 14vw;
  }
}
</style>