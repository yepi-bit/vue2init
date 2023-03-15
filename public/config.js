window.urlconfig={
    apiUrl:"/api",  //打包后的ip地址
    imgUrl:"/",  //文件服务器地址
}

// 大屏模块相关配置
window.mapSettings = {
    minZoom: 7,
    maxZoom: 20,
    center: [39.909652, 116.404177],
    zoom: 13,
    zoomMap: 9,
    tileUrl: 'http://39.101.195.215:8002/map/mapcache/gcj3857_dark/{z}/{x}/{y}.jpg',
    tileUrl2: 'http://10.10.12.110:8080/mapcache/gcj3857_dark/{z}/{x}/{y}.jpg'
    //tileUrl: 'http://10.10.12.110:8080/mapcache/gcj3857_dark/{z}/{x}/{y}.jpg'
};
