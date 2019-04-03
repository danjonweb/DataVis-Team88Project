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

</style>


<!--

    <div class="bg"></div>
    <div class="nav-links-holder">
      <div v-if="this.$store.state.showAbout">
        <router-link to="/about" class="app-links">
          About
          <br>Team 88
        </router-link>
      </div>

      <div v-else>
        <router-link to="/" class="app-links">Home</router-link>
      </div>
    </div>

    <div class="title-holder">
      <div class="text-holder">
        <h1 class="title-text">Destination Exploration</h1>
      </div>
    </div>

    <div v-if="this.$store.state.showAbout" class="project-links-holder app-links">
      <router-link to="/project" class="app-links">
        Project
        <br>Docs
      </router-link>
    </div>
  </div>

-->