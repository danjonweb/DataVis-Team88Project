<template>
  <section class="visualization">
    <div id="map"></div>
  </section>
</template>

<script>
// @ is an alias to /src
import * as d3 from "d3";

export default {
  name: "Team88Visual",
  components: {},
  data: function() {
    return {
      background:
        "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg",
      start_x: null,
      start_y: null,
      projection: null,
      scale: 200,
      svg: null,
      path: null,
      g: null,
      drag_handler: null
    };
  },
  computed: {
    cities() {
      return this.$store.state.cities;
    }
  },
  methods: {
    createMap() {

      this.projection = d3
        .geoMercator()
        .center([0, 5])
        .scale(this.scale)
        .rotate([-180, 0]);

      this.svg = d3
        .select("#map")
        .append("svg:svg")
        .attr("width", document.getElementById("map").clientWidth * 10)
        .attr("height", document.getElementById("map").clientHeight * 10);

      (this.path = d3.geoPath().projection(this.projection)),
        (this.g = this.svg.append("g"));

      this.g
        .append("image")
        .attr("xlink:href", this.background)
        .append("path")
        .attr("d", this.path);

      this.request();
    },

    request() {
      const circles = this.g
        .selectAll("circle")
        .data(this.cities)
        .enter()
        .append("a")
        .attr("xlink:href", d => `https://www.google.com/search?q=${d.city}`)
        .append("circle")
        .attr("cx", d => this.projection([d.lon, d.lat])[0])
        .attr("cy", d => this.projection([d.lon, d.lat])[1])
        .attr("r", 5)
        .style("fill", "red");

      this.drag_handler = d3
        .drag()
        .on("start", this.drag_start)
        .on("drag", (d, i, a) => this.drag_drag(d, i, a));

      this.drag_handler(circles);
    },

    drag_start() {
      this.start_x = +d3.event.x;
      this.start_y = +d3.event.y;
    },

    drag_drag(d, i, a) {
      // eslint-disable-next-line
      console.log(
        "lon x lat",
        this.projection.invert([d3.event.x, d3.event.y])
      );
      
      d3.select(a[i])
        .attr("cx", (d.x = d3.event.x))
        .attr("cy", (d.y = d3.event.y));
    }
  },
  mounted() {
    this.createMap();
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10]) //zoom limit
      .on("zoom", () => {
        this.g.style("stroke-width", `${1.5 / d3.event.transform.k}px`);
        this.g.attr("transform", d3.event.transform); // updated for d3 v4
      });

    this.svg
      .call(zoom)
      //.call(zoom.transform, d3.zoomIdentity.translate(200, 20).scale(0.25)) //initial size
      .append("svg:g")
      .attr("transform", "translate(100,50) scale(.5,.5)");
  }
};
</script>

<style scoped lang='scss'>
.map {
  width: 100%;
  height: 100%;
}
.visualization {
  height: 62vh;
  width: 100vw;
  min-width: 100vw;
  background-color: rgb(247, 247, 247);
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  border: 1px solid #000;
  border-top: none;
  overflow: auto;
}

@media (orientation: landscape), (min-width: 769px) {
  .map {
    width: 100%;
    height: 100%;
  }
  .visualization {
    width: 70vw;
    height: 92vh;
    min-width: 48px;
    background-color: rgb(247, 247, 247);
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box;
    border: 1px solid #000;
    border-top: none;
  }
}
</style>

