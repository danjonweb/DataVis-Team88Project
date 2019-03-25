<template>
  <div class="menu-title">
    <div class="bg"></div>
    <h1 class="title-text">Menus</h1>
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
  box-shadow: 0vh 3px 3px rgba(15, 12, 1, 0.226);
  width: 100vw;
  height: 5vh;
}

.menu-title .bg {
  width: 100vw;
  height: 5vh;
  background: url(../../assets/banner.png);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  position: absolute;
  z-index: -1;
  opacity: 0.6;
}

.title-text {
  margin: 0;
  padding: 1vh;
  height: 5vh;
  font-size: calc(12px + 0.9vh);
}

@media (orientation: landscape), (min-width: 733px) {
  .menu-title {
  width: 30vw;
  min-width: 300px;

}

.menu-title .bg {
  width: 30vw;
  min-width: 300px;
}
}
</style>

