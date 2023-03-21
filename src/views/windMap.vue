<template>
  <div>
    <div id="map"></div>
    <div id="currentPoint" class="current-point">
      <div id="wind-value"></div>
      <div id="scale-value"></div>
    </div>
    <div id="timetip" class="marker_timetip_3Jw">
      <div>数据时间: 暂无</div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: "windMap",
  data() {
    return {
      map: null,
      tileLayer: null,
      windField: null,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      //初始化地图
      // this.map = L.map("map").setView([39.085294, 112.201538], 6);
      this.map = L.map('map', {
        center: [39.085294, 112.201538],
        zoom: 6
      });
      this.tileLayer = L.tileLayer(
          "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}", {
            TMS: false
          }
      ).addTo(this.map);
      var dataTime = new Date();
      document.getElementById("timetip").innerHTML = "<div>" + "数据时间: " + L.windUtil().rebuildTime(dataTime, 9) + "</div>";

      //风场图层初始化
      this.windField = L.velocityLayer({
        velocityScale: [0.008], //线条速度
        particleMultiplier: 1 / 800, //线条密度
        maxVelocity: 10, //颜色配比
        colorScale: ["#fff"]
      });
      //风场数据加载
      L.windUtil().getImgData(dataTime,
          L.windUtil().options.products["wind"],
          function (res) {
            this.windField.setData(res);
            this.windField.addTo(this.map);
          });

      //降水图层初始化
      var scaleLayer = L.scaleLayer({
        opacity: 0.7     //透明度
      });
      //降水图层数据加载
      var tpproduct = L.windUtil().options.products["tp"]
      var tpscale = chroma.scale(tpproduct.color).domain(tpproduct.range);
      L.windUtil().getImgData(
          dataTime,
          tpproduct,
          function (res) {
            var s = L.ScalarField.fromPNGGrid(res[0]);
            scaleLayer.setColor(tpscale);
            scaleLayer.setData(s, tpproduct);
            // scaleLayer.addTo(this.map);
          });

      //温度图层初始化
      var tempLayer = L.scaleLayer({
        opacity: 0.7     //透明度
      });
      //温度图层数据加载
      var tempproduct = L.windUtil().options.products["temp"]
      var tempscale = chroma.scale(tempproduct.color).domain(tempproduct.range);
      L.windUtil().getImgData(
          dataTime,
          tempproduct,
          function (res) {
            var s = L.ScalarField.fromPNGGrid(res[0]);
            tempLayer.setColor(tempscale);
            tempLayer.setData(s, tempproduct);
            // scaleLayer.addTo(this.map);
          });


      //添加图层控制
      var baseLayers = {//默认加载数组的第一个tileLayer
        "降水": scaleLayer,
        "温度": tempLayer
      };
      var overlays = {
        "风场": this.windField,
      };
      L.control.layers(baseLayers, overlays, {collapsed: false, hideSingleBase: true}).addTo(this.map);
    },
  }
}
</script>

<style scoped>
#map {
  width: 100vw;
  height: 90vh;
  background-color: #012f47;
  z-index: 3;
}

.current-point {
  width: auto;
  background: white;
  position: absolute;
  top: 200px;
  left: 500px;
  z-index: 1200;
  padding: 2px 5px;
  border-radius: 5px;
}

.marker_timetip_3Jw {
  position: fixed;
  left: 50px;
  top: 10px;
  width: fit-content;
  box-sizing: content-box;
  z-index: 1000;
  padding: 3px 10px;
  font-size: 15px;
  background: rgba(0, 0, 0, .38);
  color: #fff;
  border-radius: 4px;
}
</style>