<template>
  <section class="visualization">
    <svg class="fuller">
      <path fill="#888" :d="c()"></path>
      <path stroke="#44D8CB" fill="none" :d="s()"></path>
      <circle r="4" :cx="x()" :cy="y()" fill='red'></circle>
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
    var projection = d3.geoAlbersUsa();
    this.path = d3.geoPath().projection(projection);
    this.s = () => this.path(states);
    this.c = () => this.path(nation);
    //37.7576793,-122.5076401
    this.x = () => projection([-122.5076401, 37.7576793])[0];
    this.y = () => projection([-122.5076401, 37.7576793])[1];
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

