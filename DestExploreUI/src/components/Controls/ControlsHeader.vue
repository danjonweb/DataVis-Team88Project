<template>
  <div class="menu-banner">
    <h1 class="menu-title">Menus</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Team88ControlsHeader",
  components: {},
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang='scss'>
.menu-title {
  margin: 0;
  padding: 1vh;
  height: 5vh;
  font-size: calc(12px + 0.9vh);
  background: url(../../assets/banner.png);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  box-shadow: 0vh 3px 3px rgba(15, 12, 1, 0.226);
  position: relative;
}
</style>

