<template>
  <el-header>
    <el-menu default-active="0" class="el-menu-demo" mode="horizontal" :router="true">
      <el-menu-item index="0" :route="'/'">
        <i class="el-icon-location-outline"></i>
        <span style="font-weight: bold; font-size: 18px;">Destination Exploration</span>
      </el-menu-item>
      <el-menu-item index="1" :route="'/about'">About</el-menu-item>
      <el-menu-item index="2" :route="'/project'">Docs</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
export default {
  name: "Team88HeaderBanner",
  components: {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@media only screen and (max-width: 600px) {
  .el-menu-item[tabindex="0"] span {
    display: none;
  }
}
</style>