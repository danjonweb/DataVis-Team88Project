<template>
  <section>

    <div class="team-list">

      <h2>PROJECT DOCUMENTS</h2>

      <div v-for="doc in docs" :key="doc.name" class="doc">
        <div class="doc-name">
          <strong>{{doc.name}}</strong>
        </div>
        <a :href="doc.link" class="doc-info" target="_blank" rel="noopener">{{doc.link}}</a>
      </div>
      
    </div>

  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Team88Project",
  components: {},
  data: function() {
    return {
      docs: this.$store.state.docs
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

.doc {
  width: 100%;
  min-height: 18%;
  display: flex;
  border-bottom: 1px solid #000;
  border-top: 1px solid #000;
}

.doc-name {
  width: 20%;
}

.doc-info {
  width: 80%;
  text-align: left;
  padding: 1vh;
}
</style>
