<template>
  <div class="menu-hold">
    <div class="menu-header">
      <div class="menu-title-holder">
        <p class="title-text">Availability</p>
      </div>
      <div class="img-holder">
        <img :src="getImgUrl('avail.png')" class="my-card-img">
      </div>
    </div>
    <div class="content-holder-date">
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
  data: function() {
    return {
      dateRange: "none"
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
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../../assets/stylesheets/ControlsMenus.scss";
.content-holder-date {
  margin-top: 4vh;
}
</style>