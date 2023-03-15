<template>
  <div id="mapSituation"></div>
</template>

<script>
export default {
  name: "areaMap",
  data() {
    return {
      map: null,
      tileLayer: null,
      layerGroup: null,
      personStatusBranch: [
        {
          areaCode: "110101",
          areaName: "东城分局",
          proportion: 36,
          outControlNum: 1,
          stabilityControlNum: 10
        },
        {
          areaCode: "110102",
          areaName: "西城城分局",
          proportion: 20,
          outControlNum: 3,
          stabilityControlNum: 21
        },
        {
          areaCode: "110110",
          areaName: "顺义区",
          proportion: 81,
          outControlNum: 13,
          stabilityControlNum: 11
        }
      ],
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.map = L.map('mapSituation', {
        // crs:L.CRS.EPSG4326,
        minZoom: window.mapSettings.minZoom,
        maxZoom: window.mapSettings.maxZoom,
        center: window.mapSettings.center,
        zoom: window.mapSettings.zoomMap,
        zoomControl: false,
        attributionControl: false
      })

      this.tileLayer = L.tileLayer(`${window.mapSettings.tileUrl2}`, {
        TMS: false
      }).addTo(this.map);
      this.layerGroup = new L.FeatureGroup().addTo(this.map);
      this.initMapLayer()
    },
    initMapLayer() {
      // 加载市辖区
      var beijingJson = require("./mapJson/beijing.json");
      const _this = this
      var layerBJ = L.geoJson(beijingJson, {
        style: function (item) {
          var color = null;
          for (var j = 0; j < _this.personStatusBranch.length; j++) {
            var pItem = _this.personStatusBranch[j];
            if (item.properties.id === pItem.areaCode) {
              // pItem.proportion=Math.random()*100;
              if (0 <= pItem.proportion && pItem.proportion < 20) {
                color = '#b0ce84';
              } else if (20 >= pItem.proportion && pItem.proportion < 40) {
                color = '#8fc31f';
              } else if (40 >= pItem.proportion && pItem.proportion < 60) {
                color = '#f39800';
              } else if (60 >= pItem.proportion && pItem.proportion < 80) {
                color = '#eb6100';
              } else if (80 <= pItem.proportion) {
                color = '#ff2435';
              }
              break;
            }
          }

          return {
            weight: 1.2,
            color: '#20ce54',
            fillOpacity: 0.2,
            fillColor: color
          }
        },
        onEachFeature: function (feature, layer) {
          const attr = feature.properties;
          layer.on({
            click: function (ta) {
              var id = ta.sourceTarget.feature.properties.id
              _this.$router.push({
                name: 'map2d',
                // params: {
                //   deptCode: id,
                // }
              });
            }
          })
        }

      }).bindTooltip(function (layer) {
        var inHtml = "";
        for (var i = 0; i < _this.personStatusBranch.length; i++) {
          var pItem = _this.personStatusBranch[i];
          if (layer.feature.properties.id == pItem.areaCode) {
            inHtml += '<div>区域名称：' + pItem.areaName + '</div><div>稳控数量：' + pItem.stabilityControlNum + '</div><div>失控数量：' + pItem.outControlNum + '</div>'
            continue;
          }
        }
        return inHtml;
      }).addTo(this.layerGroup);
      // 给图层加上标注----为名称
      var layers = layerBJ.getLayers()
      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i].feature.properties.cp;
        var latlng = [layer[1], layer[0]];
        var iconHtml = '<div style="font-size:14px;width:80px;color:#8dafe6;">' + layers[i].feature.properties.name + '</div>';
        var marker = L.marker(latlng, {
          icon: L.divIcon({
            html: iconHtml,
            className: 'label'
          })
        }).addTo(this.layerGroup);
      }
    },
  }
}
</script>

<style scoped>
#mapSituation {
  width: 100vw;
  height: 90vh;
  background-color: #012f47;
  z-index: 3;
}
</style>