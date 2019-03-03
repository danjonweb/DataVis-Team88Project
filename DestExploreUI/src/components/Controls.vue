<template>
  <section class="sidebar">

    <h1 class="menu-title">Menus</h1>
    
    <div v-for="menu in menus" :key="menu.name" class="menu-hold">
      <div class="menu-card">
        <div class="img-holder">
          <img :src="getImgUrl(menu.image)" class="card-img">
        </div>
        <div class="content-holder">
          <div class="card-content">
            <p>{{menu.name}}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Team88Controls",
  components: {},
  data: function() {
    return {
      menus: this.$store.state.menus
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../assets/${pic}`);
    }
  }
};
</script>

<style scoped lang='scss'>
.move-button {
  margin-top: 25%;
}

.sidebar {
  height: 30vh;
  width: 100vw;
  min-width: 100vw;
  background-color: rgb(230, 230, 230);
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  border: 1px solid #000;
  border-top: none;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

@media (orientation: landscape), (min-width: 769px) {
  .sidebar {
    height: 92vh;
    width: 30vw;
    min-width: 48px;
    background-color: rgb(230, 230, 230);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #000;
    border-top: none;
  }
}

.menu-hold {
  display: flex;
  height: 20vh;
}

.menu-title {
  margin: 0;
  height: 7vh;
  padding-top: 3vh;
  background: url(../assets/banner.png);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.menu-card {
  width: 100%;
  height: 100%;
  margin: 0;
  border-top: 0.2vh solid rgba(163, 163, 163, 0.726);
  display: flex;
  transition: all 0.4s ease-in-out;
}

.img-holder {
  height: 100%;
  width: 50%;
  margin: 0;
}

.card-img {
  padding-top: 5vh;
  height: 50%;
}

.content-holder {
  width: 49%;
  height: 100%;
  display: table;
  text-align: right;
}

.card-content {
  padding-right: 5%;
  display: table-cell;
  vertical-align: middle;
}
</style>

