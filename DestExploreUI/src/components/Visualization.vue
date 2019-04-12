<template>
  <section class="visualization">
    <h1
      class="db-warning"
      v-if="!this.$store.state.databaseOnline"
    >Database Issue!!! Please Ensure DB is Running</h1>
    <h1 class="db-warning" v-if="this.$store.state.noResultsFound">No Results Found</h1>

    <svg class="fuller">
      <path fill="#888" :d="c()"></path>
      <path stroke="#4FCCEA" fill="none" :d="s()"></path>

      <circle
        v-for="location in locations"
        :key="location.city_name"
        :r="location.radius"
        :cx="location.lng"
        :cy="location.lat"
        :fill="location.color"
        stroke="black"
        stroke-width="2px"
      ></circle>


      <circle
        v-for="mylat in scaledUserLatLon"
        :key="'homeOuter' + mylat[0]"
        r="12"
        :cx="mylat[0]"
        :cy="mylat[1]"
        fill="#000"
      ></circle>
      <circle
        v-for="mylat in scaledUserLatLon"
        :key="'homeInner' + mylat[0]"
        r="6"
        :cx="mylat[0]"
        :cy="mylat[1]"
        fill="#28f3d8"
      ></circle>
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
      scaledUserLatLon: []
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
      var ratio = window.innerWidth / window.innerHeight;
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
      if (this.userLatLon.length > 0) {
        this.scaledUserLatLon = [this.projection(this.userLatLon)];
      }
      this.path = d3.geoPath().projection(this.projection);
      this.s = () => this.path(states);
      this.c = () => this.path(nation);

      this.locations = [];
      this.badLocations = [];
      let colors = [
        "#2EC631",
        "#30C76D",
        "#32C8A9",
        "#34AEC9",
        "#3575CA",
        "#373DCC",
        "#6D39CD",
        "#A83BCE",
        "#CF3DBC",
        "#D03F84",
        "#D1404D"
      ];
      var count = 0;
      if (this.cities.length > 0) {
        let maxScore = this.cities[0].matching_score;
        
        this.cities.forEach(city => {
          var coords = this.projection([city.lng, city.lat]);
          if (coords != undefined) {
            let goodLocation = city;
            goodLocation.lng = coords[0];
            goodLocation.lat = coords[1];

            let radius = city.matching_score - maxScore * 0.7;

            if (radius < 0) {
              radius = 2;
              goodLocation.radius = radius;
            } else {
              goodLocation.radius = radius;
            }

            goodLocation.color = colors[count];
            this.locations.push(goodLocation);
            if (count < colors.length - 1) {
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
        var currentSettings = captureAndProcess(
          this.candidateCities,
          this.closestAirports,
          this.budget,
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
      if (this.candidateCities.length > 0) {
        var currentSettings = captureAndProcess(
          this.candidateCities,
          this.closestAirports,
          this.budget,
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

.fuller {
  width: 100%;
  height: 58vh;
}

.db-warning {
  position: absolute;
  margin: 30vh 0 0 10vw;
}

@media (orientation: landscape), (min-width: 733px) {
  .visualization {
    width: 70vw;
    height: 92vh;
    min-width: 580px;
  }

  .fuller {
    width: 100%;
    height: 90vh;
  }
}
</style>

