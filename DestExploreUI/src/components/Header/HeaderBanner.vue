<template>
  <div class="header-content-holder">
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
.header-content-holder {
  width: 100vw;
  min-width: 320;
  height: 8vh;
  min-height: 30px;
  box-shadow: 0vh 3px 3px rgba(15, 12, 1, 0.226);
  display: flex;
  overflow: auto;
}

.header-content-holder .bg {
  position: absolute;
  z-index: -1;
  background: url(../../assets/banner.png);
  width: 100vw;
  min-width: 320;
  height: 8vh;
  min-height: 30px;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: 0.6;
}

.title-holder {
  width: 68vw;
  min-width: 200px;
  margin: 0;
  padding: 0;
}

.text-holder {
  margin: auto;
  width: 100%;
}

.title-text {
  margin-top: 2vh;
  padding: 0;
  width: 65vw;
  font-size: calc(9px + 2vmin);
  font-weight: 600;
  color: rgb(0, 0, 0);
}

.nav-links-holder {
  text-align: left;
  padding-left: 1vw;
  width: 18vw;
  min-width: 48px;
  font-size: calc(5px + 1.3vh);
  padding-top: 1vmin;
  font-weight: 600;
}

.project-links-holder {
  text-align: right;
  padding-right: 1vw;
  width: 15vw;
  min-width: 48px;
  font-size: calc(5px + 1.3vh);
  padding-top: 1vmin;
  font-weight: 600;
}

.app-links {
  color: rgb(29, 29, 29);
  text-decoration: none;
}

@media (min-width: 733px) {
  .header-content-holder {
    width: 100vw;
    min-width: 320;
    height: 8vh;
    min-height: 30px;
    display: flex;
    box-shadow: 0vh 0px 0px rgba(15, 12, 1, 0);
    overflow: auto;
  }

  .header-content-holder .bg {
    width: 100vw;
    min-width: 320;
    height: 8vh;
    min-height: 30px;
    display: flex;
    position: absolute;
    z-index: -1;
    background: url(../../assets/banner.png);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    opacity: 0.6;
  }
}
</style>
