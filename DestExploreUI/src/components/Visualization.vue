<template>
  <section class="visualization">
    <h1 class="db-warning" v-if="!this.$store.state.databaseOnline">Database Server Not Running</h1>
    <h1 class="calculation" v-if="this.calculating">Calculating...</h1>
    <h1 class="low-budget-warning" v-if="(this.$store.state.noResultsFound)">
      <strong>No Results:</strong>
      Ensure your budget is suitable for your trip duration.
      Try reducing Trip Duration or Disable Ariline Travel
    </h1>

    <div class="legend">
      <div v-for="leg in legend" :key="leg.name" class="marker">
        <div class="color-box" :style="'background-color:' + leg.color"></div>
        <p class="marker-name">{{ leg.name }}</p>
      </div>
    </div>

    <svg class="fuller">
      <path fill="#888" :d="c()"></path>
      <path stroke="#4FCCEA" fill="none" :d="s()"></path>

      <circle
        v-for="location in locations"
        :key="location.city_name + location.lat + location.lon"
        :r="location.radius"
        :cx="location.lng"
        :cy="location.lat"
        :fill="location.color"
        stroke="black"
        stroke-width="1px"
      >
        <title>{{`City: ${location.city_name}\nState: ${location.state} \nScore: ${location.matching_score}`}}</title>
      </circle>

      <rect
        v-for="mylat in scaledUserLatLon"
        :key="'homeInner' + mylat[0]"
        :width="mylat.sqDim"
        :height="mylat.sqDim"
        :x="mylat.location[0] - 1/2*mylat.sqDim"
        :y="mylat.location[1]- 1/2*mylat.sqDim"
        fill="#28f3d8"
        stroke="#000"
        stroke-width="3px"
      >
        <title>Starting Location</title>
      </rect>
    </svg>
  </section>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";
import usmap from "@/assets/us.json";
import { captureAndProcess } from "@/helpers/captureAndProcessSettings";

// console.log(usmap)
const states = topojson.feature(usmap, usmap.objects.states);
const nation = topojson.feature(usmap, usmap.objects.land);

export default {
  name: "Team88Visual",
  components: {},
  data: function() {
    return {
      s: null,
      path: null,
      scaledUserLatLon: [],
      calculating: true
    };
  },
  beforeMount() {
    this.$store.dispatch("getAllAirports");
    d3.select(window).on("resize", this.sizeChange);
    this.projection = d3.geoAlbersUsa();

    this.path = d3.geoPath().projection(this.projection);
    this.s = () => this.path(states);
    this.c = () => this.path(nation);

    this.sizeChange();
  },
  mounted() {
    this.calculateCandidates();
  },
  computed: {
    legend() {
      return this.$store.state.legendLayout;
    },
    cities() {
      return this.$store.state.cities;
    },
    userLatLon() {
      return this.$store.state.userLatLon;
    },
    closestAirports() {
      return this.$store.state.closestAirports;
    },
    budget() {
      return this.$store.state.budget;
    },
    dailySpend() {
      return this.$store.state.dailySpend;
    },
    airlineDisable() {
      return this.$store.state.airlineDisable;
    },
    availability() {
      return this.$store.state.availability;
    },
    tripDuration() {
      return this.$store.state.tripDuration;
    },
    weatherControlOn() {
      return this.$store.state.weatherControlOn;
    },
    userTempRange() {
      return this.$store.state.userTempRange;
    },
    userPrecipRange() {
      return this.$store.state.userPrecipRange;
    },
    activityOptions() {
      return this.$store.state.activityOptions;
    },
    selectedActivities() {
      return this.$store.state.selectedActivities;
    },
    culinaryOptions() {
      return this.$store.state.culinaryOptions;
    },
    selectedFood() {
      return this.$store.state.selectedFood;
    },
    crimeRating() {
      return this.$store.state.crimeRating;
    },
    candidateCities() {
      return this.$store.state.candidateCities;
    }
  },
  watch: {
    cities() {
      this.draw();
    },
    userLatLon() {
      this.draw();
    },
    closestAirports() {
      this.calculateCandidates();
    },
    budget() {
      this.calculateCandidates();
    },
    dailySpend() {
      this.calculateCandidates();
    },
    airlineDisable() {
      this.calculateCandidates();
    },
    availability() {
      this.calculateCandidates();
    },
    tripDuration() {
      this.calculateCandidates();
    },
    weatherControlOn() {
      this.calculateCandidates();
    },
    userTempRange() {
      this.calculateCandidates();
    },
    userPrecipRange() {
      this.calculateCandidates();
    },
    selectedActivities() {
      this.caclulateCityScores();
    },
    selectedFood() {
      this.caclulateCityScores();
    },
    crimeRating() {
      this.calculateCandidates();
    },
    candidateCities() {
      this.caclulateCityScores();
    }
  },
  methods: {
    sizeChange() {
      let ratio = window.innerWidth / window.innerHeight;
      if (ratio < 1.8 && ratio > 1) {
        this.projection
          .scale(0.9 * window.innerWidth)
          .translate([window.innerWidth / 2.8, window.innerHeight / 2.2]);
      } else if (window.innerWidth >= 733) {
        this.projection
          .scale(0.9 * window.innerWidth)
          .translate([window.innerWidth / 2.8, window.innerHeight / 2.2]);
      } else {
        this.projection
          .scale(1.3 * window.innerWidth)
          .translate([window.innerWidth / 2, window.innerHeight / 3.5]);
      }

      this.draw();
    },

    draw() {
      this.calculating = false;

      if (this.userLatLon.length > 0) {
        let locRadScale = window.innerWidth / 700;
        this.scaledUserLatLon = [
          {
            location: this.projection(this.userLatLon),
            sqDim: locRadScale * 10
          }
        ];
      }
      this.path = d3.geoPath().projection(this.projection);
      this.s = () => this.path(states);
      this.c = () => this.path(nation);

      this.locations = [];
      this.badLocations = [];

      let count = 0;

      if (this.cities.length > 0) {
        // let maxScore = this.cities[0].matching_score;
        let copyCities = JSON.parse(JSON.stringify(this.cities));

        let radScale = window.innerWidth / 1900;
        copyCities.forEach(city => {
          let coords = this.projection([city.lng, city.lat]);
          if (coords != undefined) {
            let goodLocation = city;
            goodLocation.lng = coords[0];
            goodLocation.lat = coords[1];
            goodLocation.matching_score =
              Math.round(goodLocation.matching_score * 100) / 100;

            let radius = radScale * 20;

            if (radius < 4) {
              radius = 4;
              goodLocation.radius = radius;
            } else {
              goodLocation.radius = radius;
            }

            goodLocation.color = this.legend[count].color;
            this.locations.push(goodLocation);
            if (count < this.legend.length - 1) {
              count += 1;
            }
          } else {
            this.badLocations.push([city.lat, city.lon]);
          }
        });
      }
    },

    calculateCandidates() {
      if (this.closestAirports.length > 0) {
        let currentSettings = captureAndProcess(
          this.candidateCities,
          this.closestAirports,
          this.budget,
          this.dailySpend,
          this.airlineDisable,
          this.availability,
          this.tripDuration,
          this.weatherControlOn,
          this.userTempRange,
          this.userPrecipRange,
          this.crimeRating,
          this.selectedActivities,
          this.activityOptions,
          this.selectedFood,
          this.culinaryOptions
        );

        this.$store.dispatch("calculateCandidateCities", currentSettings);
      }
    },
    caclulateCityScores() {
      this.calculating = true;
      if (this.candidateCities.length > 0) {
        let currentSettings = captureAndProcess(
          this.candidateCities,
          this.closestAirports,
          this.budget,
          this.dailySpend,
          this.airlineDisable,
          this.availability,
          this.tripDuration,
          this.weatherControlOn,
          this.userTempRange,
          this.userPrecipRange,
          this.crimeRating,
          this.selectedActivities,
          this.activityOptions,
          this.selectedFood,
          this.culinaryOptions
        );
        this.$store.dispatch("calculateCityScores", currentSettings);
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.visualization {
  height: 52vh;
  width: 100vw;
  background-color: rgb(247, 247, 247);
  overflow: auto;
  box-shadow: inset 10px -10px 8px -9px rgba(15, 12, 1, 0.226);
}

.legend {
  display: flex;
  position: absolute;
  top: 9vh;
  text-align: center;
  left: 0.4vw;
  width: 80vw;
  margin: 0 0 0 10vw;
  padding-left: 1vw;
  border-radius: 1vmin;
  background-color: rgb(136, 136, 136);
}

.marker {
  display: flex;
}

.color-box {
  height: 3vmin;
  width: 3vmin;
  margin: 0.5vmin 0 0.5vmin 0;
  border: 1px solid black;
  border-radius: 1.5vmin;
}

.marker-name {
  padding: 0.5vmin 0 0.5vmin 0;
  margin: 0 2vmin 0.5vmin 0.5vw;
  font-size: calc(0.75vmin + 8px);
  color: rgb(236, 236, 236);
}

.fuller {
  width: 100%;
  height: 52vh;
}

.calculation {
  position: absolute;
  width: 75vw;
  font-size: calc(3vmin + 10px);
  margin: 5vh 0px;
}

.db-warning {
  position: absolute;
  margin: 5vh 0 0 10vw;
}

.low-budget-warning {
  color: #2d3030;
  position: absolute;
  font-size: calc(2vmin + 10px);
  width: 90vw;
  margin: 5px 10px;
}

@media (orientation: landscape), (min-width: 733px) {
  .visualization {
    width: 70vw;
    height: 92vh;
    min-width: 580px;
  }

  .legend {
    display: flex;
    position: absolute;
    top: 9vh;
    left: 0.4vw;
    width: 65vw;
    max-width: 565px;
    padding-left: 2vw;
    border-radius: 1vmin;
    margin-left: unset;
    background-color: rgb(136, 136, 136);
  }

  .fuller {
    width: 100%;
    height: 90vh;
  }

  .low-budget-warning {
    color: #2d3030;
    position: absolute;
    font-size: calc(2vmin + 10px);
    width: 60vw;
    margin: 5px 10px;
  }
}
</style>

