<template>
  <section class="visualization">
    <svg class="fuller">
      <path fill="#888" :d="c()"></path>
      <path stroke="#4FCCEA" fill="none" :d="s()"></path>

      <circle
        v-for="location in locations"
        :key="location[0].toString()"
        r="7"
        :cx="location[0]"
        :cy="location[1]"
        fill="red"
      ></circle>
    </svg>
  </section>
</template>

<script>
import * as d3 from "d3";
// import * as d3geo from "d3-geo";
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
      path: null
    };
  },
  beforeMount() {
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
    }
  },
  watch: {
    cities() {
      this.draw();
    },
    budget() {
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
      this.path = d3.geoPath().projection(this.projection);
      this.s = () => this.path(states);
      this.c = () => this.path(nation);
      // insert algo here
      this.locations = [];
      this.cities.forEach(city => {
        if (city.cost <= this.budget) {
          var coords = this.projection([city.lon, city.lat]);
          this.locations.push(coords);
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
  min-width: 100vw;
  background-color: rgb(247, 247, 247);
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  border: 1px solid #000;
  border-top: none;
  overflow: auto;
  box-shadow: inset 10px -10px 8px -9px rgba(15, 12, 1, 0.226);
}
.fuller {
  width: 100%;
  height: 100%;
}

@media (orientation: landscape), (min-width: 733px) {
  .visualization {
    width: 70vw;
    height: 92vh;
    min-width: 580px;
    background-color: rgb(247, 247, 247);
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box;
    border: 1px solid #000;
    border-top: none;
  }
  .fuller {
    width: 100%;
    height: 100%;
  }
}
</style>

