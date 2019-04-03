<template>
  <el-collapse-item title="Activities" name="4">
    <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
    <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
  </el-collapse-item>
  
  <!--
  <div>
    <div class="menu-header" :class="{active: !activityExpand}" @click="expand">
      <div class="menu-title-holder" :class="{active: !activityExpand}" @click="expand">
        <p class="title-text">Activity</p>
      </div>
      <div class="img-holder" :class="{active: !activityExpand}" @click="expand">
        <img :src="getImgUrl('active.png')" class="my-card-img">
      </div>
    </div>
    <transition name="expand">
      <div v-if="activityExpand" class="activity-holder menu-background">
        <b-button
          id="exPopoverReactive1"
          :disabled="popoverShow"
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
              <span class="d-inline-block" aria-hidden="true">&nbsp; &times; &nbsp;</span>
            </b-button>
            <strong>Activity Selection</strong>
          </template>

          <div>
            <b-form-group label="Activities">
              <b-form-checkbox-group switches v-model="selected" stacked :options="options"/>
            </b-form-group>
          </div>
        </b-popover>
      </div>
    </transition>
  </div>
-->
</template>

<script>
// @ is an alias to /src
export default {
  name: "Team88ActivityControls",
  components: {},
  props: {
    activityExpand: Boolean
  },
  data: function() {
    return {
      popoverShow: false,
      selected: [], // Must be an array reference!
      options: this.$store.state.activityOptions,
      itemsSelected: false,
      buttonFill: "outline-primary",
      expanded: false
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onClose() {
      this.popoverShow = false;
    },
    expand() {
      this.exapnded = this.activityExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  },
  watch: {
    selected() {
      if (this.selected.length > 0) {
        this.itemsSelected = true;
        this.buttonFill = "primary";
      } else {
        this.itemsSelected = false;
        this.buttonFill = "outline-primary";
      }
    }
  }
};
</script>

<style scoped lang='scss'>

</style>