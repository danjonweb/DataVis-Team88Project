<template>
  <div class="menu-hold">
    <div class="menu-header">
      <div class="menu-title-holder">
        <p class="title-text">Weather</p>
      </div>
      <div class="img-holder">
        <img :src="getImgUrl('weather.png')" class="my-card-img">
      </div>
    </div>
    <div class="content-holder">
      <button @click="clickbutton">click</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88WeatherControls",
  components: {},
  data: function() {
    return {};
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    clickbutton() {
      this.$store.dispatch("modCities");
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
</style>