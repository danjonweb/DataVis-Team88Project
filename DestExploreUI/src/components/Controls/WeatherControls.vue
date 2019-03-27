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
          <b-input-group class="toggle-weather" prepend="Enable">
            <b-input-group-prepend is-text>
              <input
                type="checkbox"
                :checked="idealOn"
                v-on:change="idealChange()"
                aria-label="Checkbox for following text input"
              >
            </b-input-group-prepend>
          </b-input-group>

          <b-button-group class="weather-buttons">
            <b-button :disabled="!idealOn" variant="outline-primary">Cool</b-button>
            <b-button :disabled="!idealOn" variant="outline-secondary">Mild</b-button>
            <b-button :disabled="!idealOn" variant="outline-danger">Warm</b-button>
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

          <b-input-group class="temp-box">
            <b-input-group-text slot="prepend" class="pre-tag">+/- Tolerance (F)</b-input-group-text>

            <b-form-input
              type="number"
              :disabled="!idealOn"
              :value="tempTol"
              v-on:change="tempTolValueChange($event)"
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
      idealOn: false,
      tempTol: 15,
      idealTemp: 72,
      expanded: false,
      simple: true
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
    },
    setAdvanced() {
      this.simple = !this.simple;
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