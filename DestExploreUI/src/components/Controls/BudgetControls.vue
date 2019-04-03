<template>
<el-collapse-item title="Budget" name="1">
  <el-row>
    <el-col>
      <el-input placeholder="" v-model="budget">
        <template slot="prepend">$</template>
        <template slot="append">each</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
    <el-checkbox v-model="airlineDisable">Disable airline travel</el-checkbox>
    </el-col>
  </el-row>
</el-collapse-item>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88BudgetControls",
  components: {},
  data: function() {
    return {
      budget: 1000,
      airlineDisable: false
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onChange(e) {
      this.budget = e;
      this.$store.dispatch("setBudgetAction", e);
    },
    expand() {
      this.expanded = this.budgetExpand;
      this.$emit("expanded", [!this.expanded]);
    },
    airDisableChange() {
      this.airlineDisable = !this.airlineDisable;
    }
  }
};
</script>

<style scoped lang='scss'>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>

