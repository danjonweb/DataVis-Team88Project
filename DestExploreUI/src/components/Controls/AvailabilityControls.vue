<template>
  <el-collapse-item title="Availability" name="2">
    <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
    <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
  </el-collapse-item>

<!--
  <div>
    <div class="menu-header" :class="{active: !availabilityExpand}" @click="expand">
      <div class="menu-title-holder" :class="{active: !availabilityExpand}" @click="expand">
        <p class="title-text">Availability</p>
      </div>
      <div class="img-holder" :class="{active: !availabilityExpand}" @click="expand">
        <img :src="getImgUrl('avail.png')" class="my-card-img">
      </div>
    </div>
    <transition name="expand">
      <div v-if="availabilityExpand" class="availability-holder menu-background">
        <VueHotelDatepicker
          class="date-picker"
          mobile="mobile"
          :value="dateRange"
          v-on:update="changeDateRange($event)"
          v-on:reset="changeDateRange('reset')"
          v-on:close="changeDateRange('close')"
        />
        <b-input-group class="dur-box">
          <b-input-group-text slot="prepend" class="pre-tag">Trip Duration (days)</b-input-group-text>

          <b-form-input
            type="number"
            :disabled="false"
            :value="tripDuration"
            v-on:change="tripDurationChange($event)"
            aria-label="Text input with checkbox"
          />
        </b-input-group>
      </div>
    </transition>
  </div>

-->
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