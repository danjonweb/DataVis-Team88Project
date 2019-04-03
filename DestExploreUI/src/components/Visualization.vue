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
      let map = L.map('map').setView([39.82, -98.58], 4);
      this.map = map;
      this.tileLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
      	attribution: '',
      	subdomains: 'abcd',
      	minZoom: 0,
      	maxZoom: 20,
      	ext: 'png'
      }).addTo(this.map);
      L.svg().addTo(this.map);
      
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


</style>


<!--

<div style="display: flex;" class="address-input">
  <b-form-input
    type="text"
    v-model="place"
    placeholder="Enter Starting Zip or Address"
    aria-label="Text input with checkbox"
    v-on:keyup.enter="()=>getMore(place)"
  />
  <b-button @click="()=>getMore(place)">Set</b-button>
</div>
<p class="address-text">
  <strong>Starting Location:</strong>
  {{local}}
</p>
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

  <circle
    v-for="mylat in scaledPlaceLatLon"
    :key="'homeOuter' + mylat[0]"
    r="12"
    :cx="mylat[0]"
    :cy="mylat[1]"
    fill="#000"
  ></circle>
  <circle
    v-for="mylat in scaledPlaceLatLon"
    :key="'homeInner' + mylat[0]"
    r="6"
    :cx="mylat[0]"
    :cy="mylat[1]"
    fill="#28f3d8"
  ></circle>
</svg>
  
  
  
  
        <el-collapse-item title="Consistency" name="1">
          <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
          <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
        </el-collapse-item>
        <el-collapse-item title="Feedback" name="2">
          <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
          <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
        </el-collapse-item>
        <el-collapse-item title="Efficiency" name="3">
          <div>Simplify the process: keep operating process simple and intuitive;</div>
          <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
          <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
        </el-collapse-item>
        <el-collapse-item title="Controllability" name="4">
          <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
          <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
        </el-collapse-item>  
  
  
-->
