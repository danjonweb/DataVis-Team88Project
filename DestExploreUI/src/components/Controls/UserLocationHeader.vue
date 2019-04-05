<template>
  <section>
    <h1 v-if="this.noInternet" class="internet-off">Check Internet Connection</h1>
    <div style="display: flex;" class="address-input">
      <b-form-input
        type="text"
        v-model="place"
        placeholder="Enter Starting Location"
        aria-label="Text input with checkbox"
        v-on:keyup.enter="()=>getUserLocation(place)"
      />
      <b-button size="md" class="loc-button" @click="()=>getUserLocation(place)">Set</b-button>
    </div>
    <p class="address-text">
      <strong>Starting Location:</strong>
      {{local}}
    </p>
  </section>
</template>

<script>
// @ is an alias to /src
import * as axios from "axios";

export default {
  name: "Team88UserLocationHeader",
  components: {},
  data: function() {
    return {
      placeLatLon: [],
      noInternet: false,
      theKi: "JmtleT1BSXphU3lCRENZR2hkSnRDNEdUMnA3NHBBc0ZtazloV19sX1lDdDQ=",
      thePrepend:
        "aHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPQ==",
      daip: "aHR0cDovL2lwaW5mby5pby9qc29uP3Rva2VuPTI5NDE2ZmYzYTM1ZjE0",
      place: "",
      local: ""
    };
  },
  beforeMount() {
    this.getDefaultLocaiton();
  },
  methods: {
    getDefaultLocaiton() {
      axios
        .get(atob(this.daip))
        .then(response => {
          this.placeLatLon = [
            Number(response.data.loc.split(",")[1]),
            Number(response.data.loc.split(",")[0])
          ];
          this.local =
            "IP Default - " + response.data.city + ", " + response.data.region;
          this.$store.dispatch("getClosestAirports", [
            this.placeLatLon[1],
            this.placeLatLon[0]
          ]);
          this.$store.dispatch("setStartingLocation", this.placeLatLon);
        })
        .catch(err => {
          if (err) {
            this.noInternet = true;
          }
        });
    },
    getUserLocation(userLocInput) {
      var inputLocation = userLocInput.toString();
      axios
        .get(`${atob(this.thePrepend)}${inputLocation}${atob(this.theKi)}`)
        .then(({ data }) => {
          this.local = data.results[0].formatted_address;
          this.placeLatLon = [
            data.results[0].geometry.location.lng,
            data.results[0].geometry.location.lat
          ];

          this.$store.dispatch("getClosestAirports", [
            this.placeLatLon[1],
            this.placeLatLon[0]
          ]);

          this.$store.dispatch("setStartingLocation", this.placeLatLon);
        })
        .catch(err => {
          if (err) {
            this.getDefaultLocaiton();
          }
        });
    }
  }
};
</script>

<style scoped lang='scss'>
.address-input {
  text-align: left;
  width: 98%;
}

.loc-button {
  background-color: #a0a0a0;
  color: rgb(77, 77, 77);
  font-weight: 700;
  margin-left: 0.5vw;
}

.address-text {
  text-align: left;
  width: 98%;
  color: rgb(237, 237, 237);
  font-size: calc(0.6vmin + 12px);
}

.internet-off {
  font-size: 6vh;
}
</style>

