<template>
  <section class="visualization">
    <h1
      class="db-warning"
      v-if="!this.$store.state.databaseOnline"
    >Database Issue!!! Please Start DB</h1>

    <svg class="fuller">
      <path fill="#888" :d="c()"></path>
      <path stroke="#4FCCEA" fill="none" :d="s()"></path>

      <circle
        v-for="location in locations"
        :key="location[0].toString()"
        r="6"
        :cx="location[0]"
        :cy="location[1]"
        fill="red"
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
  computed: {
    cities() {
      return this.$store.state.cities;
    },
    budget() {
      return this.$store.state.budget;
    },
    userLatLon() {
      return this.$store.state.userLatLon;
    }
  },
  watch: {
    cities() {
      this.draw();
    },
    budget() {
      this.draw();
    },
    userLatLon() {
      this.draw();
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

      this.cities.forEach(city => {
        if (city.cost <= this.budget) {
          var coords = this.projection([city.lon, city.lat]);
          if (coords != undefined) {
            this.locations.push(coords);
          } else {
            this.badLocations.push([city.lat, city.lon]);
          }
        }
      });
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

