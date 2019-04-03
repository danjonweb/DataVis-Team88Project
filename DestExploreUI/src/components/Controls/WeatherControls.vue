<template>
  <el-collapse-item title="Weather" name="3">
    <el-button-group>
      <el-button type="primary">Cool</el-button>
      <el-button type="info">Mild</el-button>
      <el-button type="danger">Warm</el-button>
    </el-button-group>
  </el-collapse-item>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88WeatherControls",
  components: {},
  data: function() {
    return {
      idealOn: false,
      tempTol: 15,
      idealTemp: 72,
      expanded: false,
      simple: true
    };
  },
  computed: {
    // a computed getter
    minTemp: function() {
      return this.idealTemp - this.tempTol;
    },
    maxTemp: function() {
      return this.idealTemp + this.tempTol;
    }
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    idealChange() {
      this.idealOn = !this.idealOn;
      if (!this.idealOn) {
        console.log("Temp Preference Off");
      } else {
        console.log("Min", this.minTemp, "Max", this.maxTemp);
      }
    },
    tempTolValueChange(e) {
      this.tempTol = parseInt(e);
      console.log("Min", this.minTemp, "Max", this.maxTemp);
    },
    idealTempValueChange(e) {
      this.idealTemp = parseInt(e);
      console.log("Min", this.minTemp, "Max", this.maxTemp);
    },
    expand() {
      this.exapnded = this.weatherExpand;
      this.$emit("expanded", [!this.expanded]);
    },
    setAdvanced() {
      this.simple = !this.simple;
    }
  }
};
</script>

<style scoped lang='scss'>

</style>