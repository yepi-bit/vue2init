<template>
  <div id="map"></div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  data() {
    return {
      map: null,
      tileLayer: null,
      plotLayer: null,
      peoplePoint: null,
      polygonList: [],
      peopleData: [
        {
          cardNo: "暂无",
          category: "2",
          homeAddress: "fff",
          id: "1573186421174042625",
          lat: "39.92442619592001",
          lon: "116.44072998974607",
          name: "刘打球去",
          national: "暂无",
          policeStation: "官园派出所",
          policemanName: "李晓",
          registerAddress: "暂无",
        }, {
          cardNo: "暂无",
          category: "1",
          homeAddress: "fff",
          id: "1573186421174042625",
          lat: "39.918106912082784",
          lon: "116.45240296337889",
          name: "哈哈哈",
          national: "暂无",
          policeStation: "官园派出所",
          policemanName: "李晓",
          registerAddress: "暂无",
        },
        {
          cardNo: "暂无",
          category: "1",
          homeAddress: "fff",
          id: "1573186421174042625",
          lat: "39.9281121754982",
          lon: "116.36863221142576",
          name: "哈哈哈",
          national: "暂无",
          policeStation: "官园派出所",
          policemanName: "李晓",
          registerAddress: "暂无",
        }],
      areaData: [
        {
          gis: [[39.916790321211664, 116.42322052929686], [39.937852737615195, 116.4204739472656], [39.94996069259451, 116.45686615917967], [39.93206121910532, 116.47197236035154], [39.899935722612824, 116.46304596874998]],
          id: "1630500715984957442",
          name: "1",
          remarks: "1",
          style: "rgba(64, 158, 255,0.6)"
        }, {
          gis: [[39.94048508401427, 116.35730256054686], [39.92416290407056, 116.3655423066406], [39.89624822640703, 116.37996186230467], [39.91731696059752, 116.3820217988281]],
          id: "1627590732251140098",
          name: "海口万绿园",
          remarks: "无",
          style: "rgba(255,000,000,0.8)"
        }
      ],
      alonePeople: [
        {
          "id": "333",
          "peopleId": "1573121309620932609",
          "originalImg": "blob:http://localhost:8088/851c6cbf-e8af-420d-8e86-4021c54c2bd5",
          "catchImg": "https://image.baidu.com/search/detail?ct=503316480&z=0&tn=baiduimagedetail&ipn=d&cl=2&cm=1&sc=0&lm=-1&ie=gb18030&pn=2&rn=1&di=7189064908862914561&ln=30&word=%CD%BC%C6%AC&os=1619154166,2313910332&cs=443260409,3562412549&objurl=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F040221103339%2F210402103339-8-1200.jpg&bdtype=0&simid=3622166275,573644148&pi=0&adpicid=0&timingneed=&spn=0&is=0,0&fr=ala&ala=1&alatpl=normal&pos=1&oriquery=%E5%9B%BE%E7%89%87&dyTabStr=MCwzLDYsMSw0LDIsNSw3LDgsOQ%3D%3D",
          "catchBigImg": "https://image.baidu.com/search/detail?ct=503316480&z=0&tn=baiduimagedetail&ipn=d&cl=2&cm=1&sc=0&lm=-1&ie=gb18030&pn=2&rn=1&di=7189064908862914561&ln=30&word=%CD%BC%C6%AC&os=1619154166,2313910332&cs=443260409,3562412549&objurl=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F040221103339%2F210402103339-8-1200.jpg&bdtype=0&simid=3622166275,573644148&pi=0&adpicid=0&timingneed=&spn=0&is=0,0&fr=ala&ala=1&alatpl=normal&pos=1&oriquery=%E5%9B%BE%E7%89%87&dyTabStr=MCwzLDYsMSw0LDIsNSw3LDgsOQ%3D%3D",
          "name": "测试1号",
          "sex": 1,
          "category": 3,
          "cardNo": "340111199404227513",
          "location": "东大街西边街道",
          "gis": "39.92442619592001,116.44072998974607",
          "deviceCode": "MD00003",
          "deviceName": "摄像头1",
          "content": "非法上访",
          "alarmNo": null,
          "birthday": null,
          "warnTime": "2022-10-26 22:48:00",
          "warnType": 1,
          "handleStatus": 1,
          "handleTime": null,
          "handleType": null,
          "handleContent": null,
          "handlePeopleId": null,
          "handlePeopleName": null,
          "policeStationCode": null,
          "policeStationName": null,
          "policeId": null,
          "policeName": null,
          "condominium": 0,
          "controllerPhone": "15856952044,13999999999,13333333333",
          "policePhone": "0665890198987"
        }
      ],
      peopelLine:[
        {gis: "39.898109,116.34419"},
        {gis: "39.896338,116.418354"},
        {gis: "39.883051, 116.377535"}
      ]
    }
  },
  mounted() {
    this.initMap()
    this.initPoint(this.peopleData)
    this.areaInfo(this.areaData)
    this.isWarnPointInpoly(this.alonePeople)
    this.startPoint(this.peopelLine)
  },
  methods: {
    //初始化地图
    initMap() {
      this.map = L.map('map', {
        // crs:L.CRS.EPSG4326,  // 使用的坐标系，当你不确定坐标系是什么时请不要更改
        minZoom: window.mapSettings.minZoom,  // 地图的最小视图。可以重写地图图层的最小视图
        maxZoom: window.mapSettings.maxZoom,  // 地图的最大视图。可以重写地图图层的最大视图
        center: window.mapSettings.center,    // 初始化地图的地理中心
        zoom: window.mapSettings.zoom,        // 初始化地图的缩放
        zoomControl: true,  // 确定缩放控制按钮是否默认加载在地图上
        attributionControl: false // 属性控制 确定属性控制是否默认加载在地图上
      })
      this.tileLayer = L.tileLayer(`${window.mapSettings.tileUrl}`, {
        TMS: false
      }).addTo(this.map);
      this.layerPeople = new L.FeatureGroup().addTo(this.map)
      this.plotLayer = new L.FeatureGroup().addTo(this.map)
      this.plotLayerTemp = new L.FeatureGroup().addTo(this.map)
      this.peoplePoint = new L.FeatureGroup().addTo(this.map)
    },
    initPoint(data) {
      this.markerList = []
      this.layerPeople.clearLayers()
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        if (item.lat != null && item.lon != null) {
          if (item.category == 1) {
            var inhtml = '<div><img src="' + require("@/assets/nxz.png") + '" style="width: 16px;height: 16px;"></div>';
          } else {
            var inhtml = '<div><img src="' + require("@/assets/wk.png") + '" style="width: 16px;height: 16px;"></div>';
          }
          var icon = L.divIcon({
            className: 'myDivIcon',
            iconSize: [30, 30],
            iconAnchor: [6, 8],
            html: inhtml
          })
          for (const key in item) {
            if (item[key] === null || item[key] === '') {
              item[key] = '暂无'
            }
          }
          var latlng = [JSON.parse(item.lat), JSON.parse(item.lon)]
          const marker = L.marker(latlng, {icon: icon});
          marker.bindTooltip('<div>姓名：' + item.name + '</div><div>身份证号：' + item.cardNo + '</div><div>现住址：' + item.homeAddress
              + '</div><div>类别：' + item.category + '</div><div>主责派出所：' + item.policeStation + '</div><div>主责民警：' + item.policemanName + '</div>')
          marker.attr = item
          this.layerPeople.addLayer(marker)  // 将给定的图层添加到组中
          this.markerList.push(item)
        }
      }
    },
    startPoint(data) {
      var lineList = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.gis != null && item.gis != "") {
          if (i == 0) {
            var inhtml = '<div><img src="' + require("@/assets/start_icon.png") + '" style="width: 20px;height: 33px;"></div>';
            var icon = L.divIcon({
              className: 'myDivIcon',
              iconSize: [20, 33],
              iconAnchor: [8, 32],
              html: inhtml
            });
            var LatLng = item.gis.split(",");
            const marker = L.marker([LatLng[0], LatLng[1]], {icon: icon});
            this.peoplePoint.addLayer(marker);
            lineList.push([LatLng[0], LatLng[1]]);
          } else if (i == data.length - 1) {
            var inhtml = '<div><img src="' + require("@/assets/end_icon.png") + '" style="width: 20px;height: 33px;"></div>';
            var icon = L.divIcon({
              className: 'myDivIcon',
              iconSize: [20, 33],
              iconAnchor: [8, 32],
              html: inhtml
            });
            var LatLng = item.gis.split(",");
            const marker = L.marker([LatLng[0], LatLng[1]], {icon: icon});
            this.peoplePoint.addLayer(marker);
            lineList.push([LatLng[0], LatLng[1]]);
          } else {
            var LatLng = item.gis.split(",");
            lineList.push([LatLng[0], LatLng[1]]);
          }
        }
      }
      if (lineList.length > 1) {
        var polygon = L.polyline(lineList, {
          color: '#3dff70',
          weight: 3,
          opacity: 0.8,
          fillColor: '#3dff70',
          fillOpacity: 0.8
        }).addTo(this.peoplePoint);
      }
    },
    // 人员区域
    areaInfo(data) {
      this.plotLayer.clearLayers();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.gis != "") {
          // var py = JSON.parse(item.gis);
          var polygon = L.polygon(item.gis, {
            color: '#0000ff',
            weight: 1,
            opacity: 0.8,
            fillColor: '#0000ff',
            fillOpacity: 0.8
          }).addTo(this.plotLayer);
          polygon.gis = item.gis;
          this.polygonList.push(polygon);
        }
      }
    },
    isWarnPointInpoly(info) {
      var latlon = info[0].gis.split(",");
      if (this.polygonList.length > 0) {
        for (var i = 0; i < this.polygonList.length; i++) {
          var item = this.polygonList[i];
          var getLatLngs = item.getLatLngs();   // 返回当前注记的地理位置
          var pointC = this.IsPtInPoly(JSON.parse(latlon[1]), JSON.parse(latlon[0]), getLatLngs[0])
          if (pointC == true) {
            this.areaInfoTemp(item.gis);
          }
        }
      }
    },
    areaInfoTemp(data) {
      this.plotLayerTemp.clearLayers();
      var polygon = L.polygon(data, {
        color: '#ff2123',
        weight: 1,
        opacity: 0.8,
        fillColor: '#ff2b3e',
        fillOpacity: 0.8
      }).addTo(this.plotLayerTemp); // 在地图上添加注记
    },

    // 判断点是否在范围内
    IsPtInPoly: function (ALon, ALat, APoints) {
      var iSum = 0
      var iCount
      var dLon1, dLon2, dLat1, dLat2, dLon
      if (APoints.length < 3) return false
      iCount = APoints.length
      for (var i = 0; i < iCount; i++) {
        if (i == iCount - 1) {
          dLon1 = APoints[i].lng
          dLat1 = APoints[i].lat
          dLon2 = APoints[0].lng
          dLat2 = APoints[0].lat
        } else {
          dLon1 = APoints[i].lng
          dLat1 = APoints[i].lat
          dLon2 = APoints[i + 1].lng
          dLat2 = APoints[i + 1].lat
        }
        // 以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
        if (((ALat >= dLat1) && (ALat < dLat2)) || ((ALat >= dLat2) && (ALat < dLat1))) {
          if (Math.abs(dLat1 - dLat2) > 0) {
            // 得到 A点向左射线与边的交点的x坐标：
            dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - ALat)) / (dLat1 - dLat2)
            if (dLon < ALon) {
              iSum++
            }
          }
        }
      }
      if (iSum % 2 != 0) {
        return true
      }
      return false
    },
  },
  beforeDestroy() {
    this.map.remove()
  }
}
</script>
<style scoped>
#map {
  width: 100vw;
  height: 90vh;
  background-color: #012f47;
}
</style>