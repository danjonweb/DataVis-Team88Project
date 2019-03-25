<template>
  <div>
    <div class="menu-header" :class="{active: !availabilityExpand}" @click="expand">
      <div class="menu-title-holder" :class="{active: !availabilityExpand}" @click="expand">
        <p class="title-text">Availability</p>
      </div>
      <div class="img-holder" :class="{active: !availabilityExpand}" @click="expand">
        <img :src="getImgUrl('avail.png')" class="my-card-img">
      </div>
    </div>
    <div v-if="availabilityExpand" class="availability-holder menu-background">
      <VueHotelDatepicker
        class="date-picker"
        mobile="mobile"
        :value="dateRange"
        v-on:update="changeDateRange($event)"
        v-on:reset="changeDateRange('reset')"
        v-on:close="changeDateRange('close')"
      />
    </div>
  </div>
</template>

<script>
import VueHotelDatepicker from "@northwalker/vue-hotel-datepicker";
// @ is an alias to /src
export default {
  name: "Team88AvailabilityControls",
  components: {
    VueHotelDatepicker
  },
  props: {
    availabilityExpand: Boolean
  },
  data: function() {
    return {
      dateRange: "none",
      expanded: false
    };
  },
  methods: {
    getImgUrl(pic) {
      return require(`../../assets/${pic}`);
    },
    changeDateRange(dr) {
      var startDate = dr.start;
      var endDate = dr.end;
      // `${startDate} ${endDate}`
      console.log(startDate, endDate);
    },
    expand() {
      this.exapnded = this.availabilityExpand;
      this.$emit("expanded", [!this.expanded]);
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.availability-holder {
  padding: 4vh 0 4vh 0;
  overflow: show;
}
</style>