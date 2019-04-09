<template>
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
            <b-form-group label="Activity Categories">
              <b-button-group vertical>
                <div v-for="optionGroup in Object.keys(options)" :key="optionGroup">
                  <b-button size="sm" :id="optionGroup" class="category-button">{{optionGroup}}</b-button>
                  <b-popover
                    :target="optionGroup"
                    triggers="click"
                    :show.sync="nestedPopoverShow[optionGroup]"
                    placement="auto"
                    container="myContainer"
                    ref="popover"
                  >
                    <template slot="title">
                      <b-button
                        @click="onNestedClose(optionGroup)"
                        class="close"
                        aria-label="Close"
                      >
                        <span class="d-inline-block" aria-hidden="true">&nbsp; &times; &nbsp;</span>
                      </b-button>
                      <strong>{{optionGroup}}</strong>
                    </template>
                    <b-form-checkbox-group
                      switches
                      v-model="selected"
                      stacked
                      :options="options[optionGroup]"
                    />
                  </b-popover>
                </div>
              </b-button-group>
            </b-form-group>
          </div>
        </b-popover>
      </div>
    </transition>
  </div>
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
      nestedPopoverShow: {},
      selected: [],
      itemsSelected: false,
      buttonFill: "outline-primary",
      expanded: false
    };
  },
  beforeMount() {
    this.$store.dispatch("getAllActivities");
  },
  computed: {
    options: {
      get() {
        return this.$store.state.activityOptions;
      },
      set() {
        this.$store.state.activityOptions;
      }
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
    },
    nestedPopoverShow() {
      var popOverNest = {};
      var activeCats = Object.keys(this.$store.state.activityOptions);
      activeCats.forEach(activity => {
        popOverNest[activity] = false;
      });
      return popOverNest;
    }
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    onClose() {
      this.popoverShow = false;
    },
    onNestedClose(arg) {
      this.nestedPopoverShow[arg] = false;
    },
    expand() {
      this.exapnded = this.activityExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  }
};
</script>

<style lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.activity-holder {
  padding: 4vh 0 4vh 0;
  overflow: auto;
}

.popover-body {
  height: 70vh;
  overflow: auto;
}

.category-button {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #fff !important;
  border-bottom: 1px solid #000 !important;
}
</style>