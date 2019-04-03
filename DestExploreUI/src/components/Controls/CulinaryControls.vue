<template>
  <el-collapse-item title="Cuisine" name="5">
    <el-select
      v-model="cuisines"
      multiple
      collapse-tags
      placeholder="Select cuisines">
      <el-option
        v-for="item in this.$store.state.culinaryOptions"
        :key="item.value"
        :label="item.text"
        :value="item.value">
      </el-option>
    </el-select>
  </el-collapse-item>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88CulinaryControls",
  components: {},
  data: function() {
    return {
      cuisines: []
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onClose() {
      this.foodPopoverShow = false;
    },
    expand() {
      this.exapnded = this.culinaryExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  },
  watch: {
    foodSelected() {
      if (this.foodSelected.length > 0) {
        this.itemsSelected = true;
        this.buttonFill = "primary";
      } else {
        this.itemsSelected = false;
        this.buttonFill = "outline-primary";
      }
    }
  }
};
</script>

<style scoped lang='scss'>

</style>