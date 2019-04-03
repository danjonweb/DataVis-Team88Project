<template>
  <el-main>
    <div id="map" class="map"></div>
    <Team88Controls/>
  </el-main>
</template>

<script>
import * as d3 from "d3";
// import * as d3geo from "d3-geo";
import * as axios from "axios";
import * as topojson from "topojson-client";
import usmap from "@/assets/us.json";
import {printSomeStuff, printLogo } from "@/components/SampleHelperFucntions"
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import Team88Controls from "@/components/Controls/Controls.vue";

// console.log(usmap)
const states = topojson.feature(usmap, usmap.objects.states);
const nation = topojson.feature(usmap, usmap.objects.land);

export default {
  name: "Team88Visual",
  components: {
    Team88Controls
  },
  data: function() {
    return {
      map: null,
      tileLayer: null,
      layers: [],
      svg: null
    };
  },
  beforeMount() {
    
  },
  mounted() {
    this.initMap();
    this.initLayers();
  },
  computed: {
    cities() {
      return this.$store.state.cities;
    },
    budget() {
      return this.$store.state.budget;
    },
    inputLocation() {
      return this.$store.state.inputLocation;
    }
  },
  watch: {
    cities() {
      
    },
    budget() {
      
    },
    inputLocation() {
      let map = this.map
      let loc = [this.$store.state.inputLocation[0], this.$store.state.inputLocation[1]]
      
      d3.select("#my-loc")
        .attr("cx", map.latLngToLayerPoint([loc[0], loc[1]]).x)
        .attr("cy", map.latLngToLayerPoint([loc[0], loc[1]]).y)
        .attr("opacity", 1)
    }
  },
  methods: {
    initMap() {
      let map = L.map('map', { zoomControl:false }).setView([39.82, -98.58], 4);
      this.map = map;
      this.tileLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
      	attribution: '',
      	subdomains: 'abcd',
      	minZoom: 4,
      	maxZoom: 4,
      	ext: 'png'
      }).addTo(this.map);
      L.svg().addTo(this.map);
      
      d3.select("#map")
        .select("svg")
        .selectAll("cities")
        .data(this.$store.state.cities)
        .enter()
        .append("circle")
          .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).x })
          .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).y })
          .attr("r", 5)
          .style("fill", "#3c78d8")
          .attr("stroke", "#3c78d8")
          .attr("stroke-width", 3)
          .attr("fill-opacity", .4)
      
      d3.select("#map")
        .select("svg")
        .append("circle")
          .attr("id", "my-loc")
          .attr("r", 8)
          .style("fill", "#aff000")
          .attr("stroke", "#aff000")
          .attr("stroke-width", 3)
          .attr("fill-opacity", .4)
          .attr("opacity", 0)
      
    },
    initLayers() {
      
    }
  }
};
</script>

<style scoped lang='scss'>
#map {
  width: 100%;
  height: calc(100vh - 101px);
}
.el-card {
  position: absolute;
  width: 300px;
  top: 100px;
  right: 40px;
  opacity: 0.9;
  z-index: 1000;
}

@media only screen and (max-width: 600px) {
  .el-card {
    position: static;
    width: 100%;
  }
}

</style>
