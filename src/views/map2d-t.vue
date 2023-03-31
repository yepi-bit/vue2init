<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  data() {
    return {
      map: null,
      tileLayer: null,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      //初始化地图
      this.map = L.map('map', {
        center: [39.085294, 112.201538],
        zoom: 6
      });
      this.tileLayer = L.tileLayer(
          "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}", {
            TMS: false
          }
      ).addTo(this.map);

      this.layerPeople = new L.FeatureGroup().addTo(this.map)
      // //添加一个坐标点
      var inhtml = '<div><img src="' + require("@/assets/wk.png") + '" style="width: 32px;height: 32px;"></div>';
      var icon = L.divIcon({
        className: 'myDivIcon',
        iconSize: [30, 30],
        iconAnchor: [6, 8],
        html: inhtml
      })
      var marker = L.marker([39.916790321211664, 116.42322052929686], {icon: icon})
      // var marker = L.marker([39.916790321211664, 116.22322052929686], {icon: icon}).addTo(this.map)
      this.layerPeople.addLayer(marker)  // 将给定的图层添加到组中

      //添加一个圆
      var circle = L.circle([36.916790321211664, 116.42322052929686], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50000
      }).addTo(this.map);

      // //添加多边形
      var polygon = L.polygon([
        [36.916790321211664, 116.42322052929686],
        [35.906790321211664, 115.42322052929686],
        [34.916790321211664, 117.82322052929686]
      ]).addTo(this.map);

      // //弹窗提醒
      marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
      circle.bindPopup("I am a circle.");
      polygon.bindPopup("I am a polygon.");

      // //页面打开时弹出弹框
      var popup = L.popup()
          .setLatLng([32.916790321211664, 117.82322052929686])
          .setContent("I am a standalone popup.")
          .openOn(this.map);

      // // //单击触发方法
      // function onMapClick(e) {
      //   L.popup()
      //       .setLatLng([e.latlng.lat, e.latlng.lng])
      //       .setContent("You clicked the map at " + e.latlng)
      //       .openOn(this.map);
      // }
      //
      // this.map.on('click', onMapClick);

      // //点击地图会弹出弹窗
      var popup1 = L.popup();
      function onMapClick2(e) {
        popup1
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(this.map);
      }
      this.map.on('click', onMapClick2);

      var latlngs = [
        [32.916790321211664, 117.82322052929686],
        [31.716790321211664, 115.82322052929686],
        [35.516790321211664, 116.82322052929686],
        [33.216790321211664, 117.32322052929686],
        [33.916790321211664, 114.82322052929686],
      ];
      var polyline = L.polyline(latlngs, { color: 'red' }).addTo(this.map);
      this.map.fitBounds(polyline.getBounds());

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

</style>