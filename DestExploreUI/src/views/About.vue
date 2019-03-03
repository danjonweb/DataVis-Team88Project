<template>
  <section>

    <div class="team-list">

      <h2>TEAM 88</h2>

      <div v-for="member in members" :key="member.name" class="member">
        <div class="member-name">
          <strong>{{member.name}}</strong>
        </div>
        <div class="member-info">{{member.info}}</div>
      </div>
      
    </div>

  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Team88About",
  components: {},
  data: function() {
    return {
      members: this.$store.state.members
    };
  },
  methods: {},
  mounted() {
    this.$store.dispatch("showHideAboutAction", false);
  }
};
</script>

<style scoped lang="scss">
.team-list {
  background-color: rgb(211, 211, 211);
  height: 83vh;
  width: 90vw;
  margin-left: 5vw;
  margin-top: 5vh;
  border: 1px solid rgb(66, 66, 66);
  border-radius: 50px 50px 50px 50px;
  overflow: auto;
}

h2 {
  margin: 0;
  padding-top: 2vh;
  padding-bottom: 2vh;
  font-size: calc(10px + 2vh);
}

.member {
  width: 100%;
  min-height: 18%;
  display: flex;
  border-bottom: 1px solid #000;
  border-top: 1px solid #000;
}

.member-name {
  width: 20%;
}

.member-info {
  width: 80%;
  text-align: left;
  padding: 1vh;
}
</style>
