<template>
  <el-collapse-item title="Activities" name="4">
    <el-select
      v-model="activities"
      multiple
      collapse-tags
      placeholder="Select activities">
      <el-option
        v-for="item in this.$store.state.activityOptions"
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
  name: "Team88ActivityControls",
  components: {},
  data: function() {
    return {
      activities: []
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onClose() {
      this.popoverShow = false;
    },
    expand() {
      this.exapnded = this.activityExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  },
  watch: {
    selected() {
      if (this.selected.length > 0) {
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