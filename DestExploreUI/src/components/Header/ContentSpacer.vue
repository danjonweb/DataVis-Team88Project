<template>
  <div class="header-content-spacer">
    <!-- This is a nothing component just used to keep the top content out
  of the banner area when the page loads.  Using this prevents the need
    to create acommidate the fixed banner with each content component-->
  </div>
</template>

<script>
export default {
  name: "Team88ContentSpacer",
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-content-spacer {
  background-color: rgb(255, 255, 255);
  width: 100vw;
  height: 8vh;
  min-height: 30px;
}
</style>
