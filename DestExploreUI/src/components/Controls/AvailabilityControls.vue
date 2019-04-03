<template>
  <el-collapse-item title="Availability" name="2">
    <el-date-picker
      v-model="availability"
      type="daterange"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date">
    </el-date-picker>
  </el-collapse-item>
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
      availability: null,
      dateRange: "none",
      expanded: false,
      tripDuration: 3
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
    },
    tripDurationChange(dur) {
      this.tripDuration = dur;
    }
  }
};
</script>

<style scoped lang='scss'>

</style>