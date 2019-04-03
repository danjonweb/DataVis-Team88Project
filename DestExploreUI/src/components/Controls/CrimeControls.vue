<template>
  <el-collapse-item title="Crime" name="6">
    <el-slider
      v-model="crimeValue"
      :min="0"
      :max="5"
      :step="0.5">
    </el-slider>
  </el-collapse-item>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88CrimeControls",
  components: {},
  data: function() {
    return {
      crimeValue: this.$store.state.crimeRating
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    expand() {
      this.exapnded = this.crimeExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  },
  watch: {
    crimeValue() {
      if (this.crimeValue >= 4.0) {
        this.colorCode = "outline-success";
      } else if (this.crimeValue < 4.0 && this.crimeValue >= 2.0) {
        this.colorCode = "outline-primary";
      } else {
        this.colorCode = "outline-dark";
      }
    }
  }
};
</script>

<style scoped lang='scss'>

</style>