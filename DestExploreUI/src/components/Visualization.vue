<template>
  <section class="visualization">
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
  </section>
</template>

<script>
import * as d3 from "d3";
// import * as d3geo from "d3-geo";
import * as axios from "axios";
import * as topojson from "topojson-client";
import usmap from "@/assets/us.json";
import {printSomeStuff, printLogo } from "@/components/SampleHelperFucntions"


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
      theKi: "JmtleT1BSXphU3lCRENZR2hkSnRDNEdUMnA3NHBBc0ZtazloV19sX1lDdDQ=",
      thePrepend:
        "aHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPQ==",
      place: "",
      local: "",
      placeLatLon: [],
      scaledPlaceLatLon: [],
      daip: "aHR0cDovL2lwaW5mby5pby9qc29uP3Rva2VuPTI5NDE2ZmYzYTM1ZjE0"
    };
  },
  beforeMount() {
    d3.select(window).on("resize", this.sizeChange);

    this.projection = d3.geoAlbersUsa();

    this.path = d3.geoPath().projection(this.projection);
    this.s = () => this.path(states);
    this.c = () => this.path(nation);

    this.sizeChange();
    printSomeStuff('HEY HEY HEY....  This is something to print TO CONSOLE !!!!!')
    printLogo()
  },
  mounted() {
    this.getDefaultLocaiton();
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
    getDefaultLocaiton() {
      axios.get(atob(this.daip)).then(response => {
        this.placeLatLon = [
          Number(response.data.loc.split(",")[1]),
          Number(response.data.loc.split(",")[0])
        ];
        this.local =
          "IP Default - " + response.data.city + ", " + response.data.region;
        this.draw();
      });
    },
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
    getMore(zip) {
      var inputLocation = zip.toString();
      axios
        .get(`${atob(this.thePrepend)}${inputLocation}${atob(this.theKi)}`)
        .then(({ data }) => {
          this.local = data.results[0].formatted_address;
          this.placeLatLon = [
            data.results[0].geometry.location.lng,
            data.results[0].geometry.location.lat
          ];
          this.scaledPlaceLatLon = [this.projection(this.placeLatLon)];
        })
        .catch(err => {
          if (err) {
            this.getDefaultLocaiton();
          }
        });
    },

    draw() {
      if (this.placeLatLon.length > 0) {
        this.scaledPlaceLatLon = [this.projection(this.placeLatLon)];
      }
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
  background-color: rgb(247, 247, 247);
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  border: 1px solid #000;
  border-top: none;
  overflow: auto;
  box-shadow: inset 10px -10px 8px -9px rgba(15, 12, 1, 0.226);
}

.address-input {
  text-align: left;
  position: absolute;
  top: 8.5vh;
  margin: 0 10vw 0 10vw;
  width: 80vw;
}

.address-text {
  margin: 0 10vw 40px 10vw;
  position: absolute;
  top: 13.5vh;
  text-align: left;
  width: 100vw;
}

.fuller {
  width: 100%;
  height: 58vh;
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
    height: 90vh;
  }

  .address-input {
    text-align: left;
    position: absolute;
    top: 8.5vh;
    left: 0.5vmin;
    margin: 0 0 0 0;
    width: 30vw;
  }

  .address-text {
    margin: 3px 0 40px 0;
    text-align: left;
    position: absolute;
    top: 13.5vh;
    left: 0.7vmin;
    width: 70vw;
  }
}
</style>

