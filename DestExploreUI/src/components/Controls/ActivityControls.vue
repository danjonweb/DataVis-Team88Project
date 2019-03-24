<template>
  <div class="menu-hold">
    <div class="menu-header">
      <div class="menu-title-holder">
        <p class="title-text">Activity</p>
      </div>
      <div class="img-holder">
        <img :src="getImgUrl('active.png')" class="my-card-img">
      </div>
    </div>
    <div class="activity-select">
      <b-button
        id="exPopoverReactive1"
        :disabled="popoverShow"
        size="sm"
        :variant="buttonFill"
        ref="button"
      >Select Activities</b-button>
      <div :hidden="!itemsSelected">Activities are selected</div>
      <b-popover
        target="exPopoverReactive1"
        triggers="click"
        :show.sync="popoverShow"
        placement="auto"
        container="myContainer"
        ref="popover"
      >
        <template slot="title">
          <b-button @click="onClose" class="close" aria-label="Close">
            <span class="d-inline-block" aria-hidden="true"> &nbsp; &times; &nbsp;</span>
          </b-button> <strong>Activity Selection</strong> 
        </template>

        <div>
          <b-form-group label="Activities">
            <b-form-checkbox-group switches v-model="selected" stacked :options="options"/>
          </b-form-group>
        </div>
      </b-popover>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88ActivityControls",
  components: {},
  data: function() {
    return {
      popoverShow: false,
      selected: [], // Must be an array reference!
      options: this.$store.state.activityOptions,
      itemsSelected:false,
      buttonFill: 'outline-primary'
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onClose() {
      this.popoverShow = false;
    }
  },
  watch: {
    selected () {
      if(this.selected.length > 0){
        this.itemsSelected = true
       this.buttonFill = 'primary'
      }else{
        this.itemsSelected = false
        this.buttonFill = 'outline-primary'
      }
    }
  }

};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.activity-select {
  margin-top: 4vh;
}

</style>