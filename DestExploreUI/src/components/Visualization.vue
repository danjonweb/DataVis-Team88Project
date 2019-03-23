<template>
  <section class="visualization">
    <svg class="fuller">
      <path fill="#888" :d="c()"></path>
      <path stroke="#44D8CB" fill="none" :d="s()"></path>

        <circle v-for="location in locations" :key="location[0].toString()" r="4" :cx="location[0]" :cy="location[1]" fill="red"></circle>

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
  methods: {
    sizeChange() {
      if (window.innerWidth > 700) {
        this.projection
          .scale(0.9 * window.innerWidth)
          .translate([window.innerWidth / 2.8, window.innerHeight / 2.2]);
      } else {
        this.projection
          .scale(1.3 * window.innerWidth)
          .translate([window.innerWidth / 2, window.innerHeight / 3.5]);
      }

      this.path = d3.geoPath().projection(this.projection);
      this.s = () => this.path(states);
      this.c = () => this.path(nation);
      //40.0292887,-105.3101892
      this.locations = [this.projection([-122.5076401, 37.7576793]), 
      this.projection([-74.2605541, 40.6971478]),
      this.projection([-81.5091793, 28.4810968]),
      this.projection([-118.6926093, 34.0201597]),
      this.projection([-80.1209284, 40.4312835]),
      this.projection([-122.4824913,47.6129428]),
      this.projection([-150.5639306, 61.1042033]),
      this.projection([-157.939503, 21.3279755]),
      this.projection([-88.9958055, 30.4265027]),
      this.projection([-105.3101892, 40.0292887]),];

    }
  }
};
</script>

<style scoped lang='scss'>
.visualization {
  height: 62vh;
  width: 100vw;
  min-width: 100vw;
  background-color: rgb(247, 247, 247);
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  border: 1px solid #000;
  border-top: none;
  overflow: auto;
}
.fuller {
  width: 100%;
  height: 100%;
}

@media (orientation: landscape), (min-width: 769px) {
  .visualization {
    width: 70vw;
    height: 92vh;
    min-width: 48px;
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

