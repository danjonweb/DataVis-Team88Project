<template>
  <el-input id="location-input" placeholder="Zip Code or Address" v-model="location" @change="lookupLocation">
    <el-button slot="append" icon="el-icon-search" @click.native="lookupLocation($event)"></el-button>
  </el-input>
</template>

<script>
// @ is an alias to /src
import * as axios from "axios";

export default {
  name: "Team88ControlsHeader",
  components: {},
  data: function() {
    return {
      location: "",
      theKi: "JmtleT1BSXphU3lCRENZR2hkSnRDNEdUMnA3NHBBc0ZtazloV19sX1lDdDQ=",
      thePrepend: "aHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9hZGRyZXNzPQ==",
      daip: "aHR0cDovL2lwaW5mby5pby9qc29uP3Rva2VuPTI5NDE2ZmYzYTM1ZjE0"
    };
  },
  mounted() {
    this.getIPLocation()
  },
  methods: {
    async getIPLocation() {
      try {
        let response = await fetch(atob(this.daip));
        let data = await response.json();
        let loc = [
          Number(data.loc.split(",")[0]),
          Number(data.loc.split(",")[1])
        ]
        this.$store.dispatch("setInputLocation", loc);
        this.location = data.city + ", " + data.region;
      } catch (err) {
        console.log(err);
      }
    },
    async lookupLocation(event) {
      let inputLocation = document.querySelector('#location-input').value;
      try {
        let response = await fetch(`${atob(this.thePrepend)}${inputLocation}${atob(this.theKi)}`);
        let data = await response.json();
        this.location = data.results[0].formatted_address;
        let loc = [
          data.results[0].geometry.location.lat,
          data.results[0].geometry.location.lng
        ];
        this.$store.dispatch("setInputLocation", loc);
      } catch (err) {
        this.getIPLocation();
      }
      this.selectLocationText(event);
    },
    selectLocationText(event) {
      setTimeout(() => {
        document.querySelector('#location-input').select();
      }, 100);
    }
  }
};
</script>

<style scoped lang='scss'>

</style>

