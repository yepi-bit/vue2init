//L.mars 简易版本，地图加载类

L.mars = (function () {



  function createMap(opt) {
    if (opt.url) {
      $.ajax({
        type: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: opt.url,
        timeout: 3000,
        success: function (config) {
          //map初始化
          var configdata = config.map;
          if (config.serverURL)
            configdata.serverURL = config.serverURL;
          if (opt.serverURL)
            configdata.serverURL = opt.serverURL;

          createMapByData(opt, configdata, config);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("Json文件" + opt.url + "加载失败！");
          haoutil.alert("Json文件" + opt.url + "加载失败！");
        }
      });
      return null;
    }
    else {
      return createMapByData(opt, opt.data);
    }
  }

  //============模块内部私有属性及方法============

  function createMapByData(options, configdata, jsondata) {

    var defoptions = {
      zoomControl: false, //不用默认的
      attributionControl: false,
      minZoom: configdata.minZoom,
      maxZoom: configdata.maxZoom,
      center: [configdata.center.y, configdata.center.x],
      zoom: configdata.zoom,

      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [
        {
          text: '移动到此处',
          iconCls: 'fa fa-hand-o-right',
          callback: function (e) {
            map.panTo(e.latlng);
          }
        }, {
          text: '显示此处经纬度',
          iconCls: 'fa fa-map-marker',
          callback: function (e) {
            var inhtml = "层级：" + map.getZoom();
            inhtml += "<br/>经度：" + e.latlng.lng.toFixed(6) + " 纬度：" + e.latlng.lat.toFixed(6);

            haoutil.alert(inhtml);
          }
        }, '-', {
          text: '放大',
          iconCls: 'fa fa-search-plus',
          callback: function (e) {
            map.zoomIn();
          }
        }, {
          text: '缩小',
          iconCls: 'fa fa-search-minus',
          callback: function (e) {
            map.zoomOut();
          }
        }
      ]
    };
    //赋默认值至options（如果已存在设置值跳过）
    if (options == null) options = {};
    for (var i in defoptions) {
      if (!options.hasOwnProperty(i)) {
        options[i] = defoptions[i];
      }
    }

    var map = L.map(options.id, options);

    //底图图层
    var ctl_layers_base = {};//用于图层控制控件
    var layersCfg = configdata.basemaps;
    if (layersCfg) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];

        var layer = createLayer(item, configdata.serverURL);
        if (layer == null) continue;

        //是否显示
        if (item.hasOwnProperty("visible") && item.visible)
          layer.addTo(map);

        ctl_layers_base[item.name] = layer;
      }
    }
    //叠加图层
    var ctl_layers_over = {}; //用于图层控制控件
    var layersCfg = configdata.operationallayers;
    if (layersCfg) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];

        var layer = createLayer(item, configdata.serverURL);
        if (layer == null) continue;

        //是否显示
        if (item.hasOwnProperty("visible") && item.visible)
          layer.addTo(map);

        ctl_layers_over[item.name] = layer;
      }
    }



    //地图控件
    var controls = {};
    var controlsCfg = configdata.controls;
    if (controlsCfg) {
      for (var i = 0; i < controlsCfg.length; i++) {
        var item = controlsCfg[i];
        if (item.hasOwnProperty("visible") && !item.visible) continue;

        var control;
        switch (item.type) {
          case "layers":
            control = L.control.layers(ctl_layers_base, ctl_layers_over, { position: item.position || "topright" });
            break;
          case "zoom":
            control = L.control.zoom({ position: item.position || "bottomright" });
            break;
          case "scale"://比例尺
            control = L.control.scale({ metric: true, imperial: false });
            break;
          case "tool":
            item.position = item.position || "bottomright";
            control = L.control.toolbar(item).addTo(map);
            break;
          case "location":
            bindLocationShow(map, item);
            break;

        }
        if (control == null) continue;

        map.addControl(control);
        controls[item.type] = control;
      }
    }


    //记录到全局变量，其他地方使用
    var gisdata = {};
    gisdata.config = configdata;
    gisdata.baselayers = ctl_layers_base;
    gisdata.overlayers = ctl_layers_over;
    gisdata.controls = controls;

    map.gisdata = gisdata;


    if (options.success)
      options.success(map, gisdata, jsondata);

    return map;
  }

  //创建地图底图
  function createLayer(item, serverURL) {
    var layer;

    if (item.url) {
      if (serverURL) {
        item.url = item.url.replace('$serverURL$', serverURL);
      }
      item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
    }
    item._crs = item.crs;
    item.crs = null;


    switch (item.type) {
      //===============地图数组====================
      case "group":
        //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
        if (item.layers && item.layers.length > 0) {
          var arrVec = [];
          for (var index = 0; index < item.layers.length; index++) {
            var temp = item.layers[index];

            var layer = createLayer(temp);
            if (layer == null) continue;
            if (temp.hasOwnProperty("visible") && !temp.visible) continue;

            arrVec.push(layer);
          }
          layer = L.layerGroup(arrVec);
        }

        break;
      //===============地图底图====================

      case "tile":

        layer = L.tileLayer(item.url, item);
        break;
      case "wms":
        layer = L.tileLayer.wms(item.url, item);
        break;
      case "esri-tile":
        layer = L.tileLayer(item.url + '/tile/{z}/{y}/{x}', item);
        break;
      case "arcgis_cache": //arcgis http 切片
        layer = L.tileLayer.arcGISTile(item.url, item);
        break;

      default:
        console.log("config配置图层未处理:" + item);
        break;
    }

    if (layer != null) {
      layer.name = item.name;

      item._layer = layer;//绑定图层到配置信息中，方便控制
    }


    return layer;
  }


  //鼠标在地图上移动提示经纬度信息控件
  function bindLocationShow(map, item) {
    if (!document.getElementById('location')) {
      $("#" + map._container.id).prepend('<div id="location" class="locationctl" ></div>');
    }

    var lastLatlngs;
    var isshowlevel = item.showlevel;

    function showLocationHtml(latlng) {
      if (latlng) {
        lastLatlngs = latlng;
      }
      var inhtml = "经度:" + lastLatlngs.lng.toFixed(6) + " 纬度:" + lastLatlngs.lat.toFixed(6);

      if (isshowlevel)
        $("#location").html(inhtml + " 第" + map.getZoom() + "级 ");
      else
        $("#location").html(inhtml);
    }

    map.on("mousemove", function mouseMoveHandler(e) {
      showLocationHtml(e.latlng);
    });

    if (isshowlevel) {
      map.on("zoomend", function mouseMoveHandler(e) {
        if (lastLatlngs == null) {
          showLocationHtml(map.getCenter());
        }
        else {
          showLocationHtml();
        }
      });
    }
  }



  //===========模块对外公开的属性及方法=========
  return {
    createMap: createMap,
    createLayer: createLayer
  };
})();



L.Map.include({
  setConvertType: function (type) {
    this.options.pointconvertType = type;
  },
  getConvertType: function () {
    return this.options.pointconvertType;
  },
  hasConvert: function () {
    var pointconvertType = this.options.pointconvertType;
    return (pointconvertType == 'gcj' || pointconvertType == 'bd');
  },

  //在不同坐标系情况下，转换“目标坐标值”至“地图坐标系”一致
  convert2map: function (latlng) {
    var jd;
    var wd;
    if (latlng.lng && latlng.lat) {
      jd = latlng.lng;
      wd = latlng.lat;
    } else {
      jd = latlng[1];
      wd = latlng[0];
    }

//        if (this.options.pointconvertType == 'gcj') {
//            var coordinate = pointconvert.wgs2gcj([jd, wd]);
//            jd = coordinate[0];
//            wd = coordinate[1];
//        }
//        else if (this.options.pointconvertType == 'bd') {
//            var coordinate = pointconvert.wgs2bd([jd, wd]);
//            jd = coordinate[0];
//            wd = coordinate[1];
//        }


    return [wd, jd];
  },

  //在不同坐标系情况下 ，获取地图上的坐标后，转为wgs标准坐标系坐标值
  convert2wgs: function (latlng) {
    var jd;
    var wd;
    if (latlng.lng && latlng.lat) {
      jd = latlng.lng;
      wd = latlng.lat;
    } else {
      jd = latlng[1];
      wd = latlng[0];
    }

//        if (this.options.pointconvertType == 'gcj') {
//            var coordinate = pointconvert.gcj2wgs([jd, wd]);
//            jd = coordinate[0];
//            wd = coordinate[1];
//        }
//        else if (this.options.pointconvertType == 'bd') {
//            var coordinate = pointconvert.bd2wgs([jd, wd]);
//            jd = coordinate[0];
//            wd = coordinate[1];
//        }

    return [wd, jd];
  },


  //定位地图至目标点（传入值为地图相同坐标系）
  centerAt: function (center, options) {
    var level = this.getZoom();
    if (this.gisdata && this.gisdata.config && this.gisdata.config.centerAutoLevel) {
      var autolevel = this.gisdata.config.centerAutoLevel;
      if (level < autolevel && this.getMaxZoom() >= autolevel) {
        level = autolevel;
      }
    }

    this.stop();
    this.setView(center, level, { pan: options });
  },


  centerAtLayer: function (layer) {

    if (layer instanceof L.Marker) {
      var latlng = layer.getLatLng();
      this.centerAt(latlng);
    }
    else if (layer instanceof L.CircleMarker) {
      var latlng = layer.getLatLng();
      this.centerAt(latlng);
    }

    else if (layer instanceof L.Circle) {
      this.fitBounds(layer.getBounds());
    }
    else if (layer instanceof L.Rectangle) {
      this.fitBounds(layer.getBounds());
    }
    else if (layer instanceof L.Polygon) {
      this.fitBounds(layer.getBounds());
    }
    else if (layer instanceof L.Polyline) {
      this.fitBounds(layer.getBounds());
    }

    else if (layer instanceof L.LayerGroup) {
      this.fitBounds(layer.getBounds());
    }
    else if (layer instanceof L.FeatureGroup) {
      this.fitBounds(layer.getBounds());
    }
  },
  //回到默认区域
  goHomeExtent: function () {
    if (this.gisdata == null || this.gisdata.config == null || this.gisdata.config.center == null)
      return;
    this.setView(this.gisdata.config.center, this.gisdata.config.zoom);
  },



});

L.mars.Draw = (function (opt) {
  var that = {
    map: null,
    layerDraw: null,
    options: opt,
    control: {},
    init: function () {
      this.map = this.options.map;
      if (this.options.layer)
        this.layerDraw = this.options.layer;
      else
        this.layerDraw = L.featureGroup().addTo(this.map, { editing: true });

      this.options.style = this.options.style || { color: '#0000ff', weight: 2 };
      var style = this.options.style;

      //编辑工具初始化
      this.control['marker'] = new L.Draw.Marker(this.map, { icon: new L.Icon.Default() });
      // this.control['text'] = new L.Draw.Text(this.map);
      // this.control['font-marker'] = new L.Draw.FontMarker(this.map);

      this.control['polyline'] = new L.Draw.Polyline(this.map, { shapeOptions: style });
      // this.control['polylinefree'] = new L.Draw.Polylinefree(this.map, { shapeOptions: style });
      this.control['rectangle'] = new L.Draw.Rectangle(this.map, { shapeOptions: style });
      this.control['circle'] = new L.Draw.Circle(this.map, { shapeOptions: style });
      this.control['polygon'] = new L.Draw.Polygon(this.map, { allowIntersection: true, showArea: true, metric: ['km', 'm'], shapeOptions: style });

      // this.control['image'] = new L.Draw.Image(this.map);

      if (!this.options.hasOwnProperty("onEvnet") || this.options.onEvnet) {
        this.onEvnet();
      }

      this.iniDefVal();
    },
    onEvnet: function () {
      //绑定事件
      this.layerDraw.on('click', this._layerDraw_clickHndler, this);
      this.map.on('click', this._map_clickHndler, this);
      this.map.on('dblclick', this._map_dblclickHndler, this);
      this.map.on('draw:created', this._map_draw_createdHndler, this);

      if (this.options.onChange && typeof (this.options.onChange) == "function") {
        this.map.on("draw:editvertex", this._map_draw_changeHandler, this);
        this.map.on("draw:editmove", this._map_draw_changeHandler, this);
        this.map.on("draw:editresize", this._map_draw_changeHandler, this);
      }
      return this;
    },
    offEvent: function () {
      //解除绑定事件
      this.layerDraw.off('click', this._layerDraw_clickHndler, this);
      this.map.off('click', this._map_clickHndler, this);
      this.map.off('dblclick', this._map_dblclickHndler, this);
      this.map.off('draw:created', this._map_draw_createdHndler, this);

      if (this.options.onChange && typeof (this.options.onChange) == "function") {
        this.map.off("draw:editvertex", this._map_draw_changeHandler, this);
        this.map.off("draw:editmove", this._map_draw_changeHandler, this);
        this.map.off("draw:editresize", this._map_draw_changeHandler, this);
      }
      return this;
    },
    destroy: function (noclear) {
      this.stopDraw();
      if (!noclear)
        this.clearDraw();
      this.offEvent();
      return this;
    },
    //开始绘制
    _drawtype: null,
    _defval: null,
    startDraw: function (type, defval) {
      if (this.control[type] == null) {
        throw '不能进行type为【' + type + '】的绘制，无该类型！';
        return;
      }
      defval= defval || this.configDefval[type];

      this._drawtype = type;
      this._defval  = defval;

      // if (this.options.isOnly) this.clearDraw();

      this.stopDraw();
      if (defval) {
        switch (type) {
          default:
            this.control[type].setOptions({ shapeOptions: defval.style });
            break;
          case "image":
            this.control[type].setOptions(defval.style);
            break;
          case "marker":
            var _icon;
            if (defval.style.hasOwnProperty('iconUrl') && defval.style.iconUrl != null && defval.style.iconUrl != "") {
              if(defval.style.iconSize0 &&  defval.style.iconSize1)
                defval.style.iconSize =   [defval.style.iconSize0, defval.style.iconSize1];
              if(defval.style.iconAnchor0 && defval.style.iconAnchor1)
                defval.style.iconAnchor =   [defval.style.iconAnchor0, defval.style.iconAnchor1];
              _icon = L.icon(defval.style);
            } else {
              _icon = new L.Icon.Default();
            }
            this.control[type].setOptions({ icon: _icon });
            break;
          case "text":
          case "font-marker":
            this.control[type].updateIcon(defval.style);
            break;
        }
      }
      this.control[type].enable();
    },
    stopDraw: function () {
      for (var type in this.control) {
        this.control[type].disable();
      }
      this.stopEditing();
      return this;
    },
    clearDraw: function () {
      this.layerDraw.clearLayers();
    },


    //==========编辑要素==========
    _hasEdit: true,
    hasEdit: function (val) {
      this._hasEdit = val;
      if (val) {
      }
      else {
        this.stopEditing();
      }
    },
    currEditFeature: null,      //当前编辑的要素
    startEditing: function (layer) {
      if (layer == null || !this._hasEdit) return
      layer.editing.enable();
      this.currEditFeature = layer;

      if (this.options.hasOwnProperty("onStartEditing") && this.options.onStartEditing) {
        this.options.onStartEditing(this.currEditFeature);
      }
    },
    stopEditing: function () {
      if (this.currEditFeature&& this.currEditFeature.editing &&  this.currEditFeature.editing.disable) {
        this.currEditFeature.editing.disable();

        if (this.options.hasOwnProperty("onStopEditing") && this.options.onStopEditing) {
          this.options.onStopEditing(this.currEditFeature);
        }
      }
      this.currEditFeature = null;
    },
    updateProperties: function (layer, attr) {
      layer = layer || this.currEditFeature;
      if (layer == null) return;

      var oldattr = layer.properties;
      if (attr) {
        layer.properties = attr;
      }
      else {
        attr = oldattr;
      }

      switch (attr.type) {
        default:
          break;
        case "marker":
          var _icon;
          if (attr.style.hasOwnProperty('iconUrl') && attr.style.iconUrl != null && attr.style.iconUrl != "") {
            var param = {
              iconUrl: attr.style.iconUrl,
              iconSize: [attr.style.iconSize0, attr.style.iconSize1],
              iconAnchor: [attr.style.iconAnchor0, attr.style.iconAnchor1],
            };
            _icon = L.icon(param);
          } else {
            _icon = new L.Icon.Default()
          }
          layer.setIcon(_icon);
          layer.setOpacity(attr.style.opacity);
          break;
        case "text":
        case "font-marker":
          layer.setOpacity(attr.style.opacity);
          var icon = this.control[attr.type].getIcon(attr.style);
          layer.setIcon(icon);
          break;
        case "polyline":
        case "polylinefree":
        case "polygon":
        case "rectangle":
          layer.setStyle(attr.style);
          break;
        case "image":
          if (layer._imageOverlay == null) {
            var imageOverlay = new L.ImageOverlay(attr.style.iconUrl, layer.getBounds(), { opacity: attr.style.opacity });
            layer._imageOverlay = imageOverlay;
            layer._imageOverlay._nosave = true;
            this.layerDraw.addLayer(layer._imageOverlay);
          }
          layer._imageOverlay.setOpacity(attr.style.opacity);
          break;
        case "circle":
          if (!attr.isSemicircle) {
            attr.startAngle = null;
            attr.stopAngle = null;
          }
          layer.setRadius(attr.style.radius);
          layer.setStyle(attr.style);
          layer.redraw();
          break;
      }
      return layer;
    },
    deleteFeature: function (layer) {
      this.layerDraw.removeLayer(layer);
    },
    //=============事件==============
    _map_clickHndler: function (e) {
      this.stopEditing();
    },
    _map_dblclickHndler: function (e) {
      L.DomEvent.stopPropagation(e); //停止冒泡
      for (var type in this.control) {
        if (this.control[type]._enabled && this.control[type]._finishShape) {
          this.control[type]._finishShape();
        }
      }
    },
    _layerDraw_clickHndler: function (e) {
      if (e.layer != this.currEditFeature)
        this.stopEditing();

      this.startEditing(e.layer);
      L.DomEvent.stopPropagation(e); //停止冒泡
    },
    _map_draw_createdHndler: function (event) {
      var layer = event.layer;
      layer.properties = this._defval;

      this._updateFeatureForEdit(layer);
      this.layerDraw.addLayer(layer);

      if (this.options.hasDel)
        this.bindDeleteContextmenu(layer);

      this.stopEditing();
      this.startEditing(layer);

      if (this.options.onCreate && typeof (this.options.onCreate) == "function") {
        this.options.onCreate(event);
      }
    },
    _map_draw_changeHandler: function (event) {
      var layer = this.currEditFeature;
      event.layer = layer;

      this._updateFeatureForEdit(layer);
      this.options.onChange(event);
    },
    _updateFeatureForEdit: function (layer) {
      if (layer.properties == null || layer.properties.type == null) return;

      switch (layer.properties.type) {
        case "circle":
          layer.properties.style.radius = parseInt(layer.getRadius());
          break;
        case "image":
          this.layerDraw.addLayer(layer._imageOverlay);

          layer._imageOverlay._nosave = true;
          layer._imageOverlay.setBounds(layer.getBounds());
          break;
      }
    },


    hasDraw: function () {
      if (this.layerDraw == null) return false;
      var layers = this.layerDraw.getLayers();
      return (layers.length > 0)
    },
    getLayer: function () {
      return this.layerDraw;
    },
    getFeatures: function () {
      if (this.hasDraw()) {
        var layers = this.layerDraw.getLayers();
        if (this.options.isOnly)
          return layers[0];
        else
          return layers;
        return layers;
      }
      else {
        return null;
      }
    },
    bindDeleteContextmenu: function (layer) {
      var $this = this;

      if (layer.bindContextMenu) {
        layer.bindContextMenu({
          contextmenu: true,
          contextmenuInheritItems: false,
          contextmenuItems: [{
            text: '删除',
            iconCls: 'fa fa-trash',
            context: layer,
            callback: function (e) {
              var layer = this;
              $this.deleteFeature(layer);
            }
          }]
        });
      }
    },






    //文件处理
    toJson: function (isJsonObj) {
      var layers = this.layerDraw.getLayers();
      if (layers.length == 0) {
        return isJsonObj?{}:"";
      }

      var features = [];
      for (var index = 0; index < layers.length; index++) {
        var layer = layers[index];
        if (layer._nosave) continue;

        var geojson = layer.toGeoJSON();
        geojson.properties = { type: layer.properties.type };  //layer.properties || {};

        var def = this.configDefval[layer.properties.type];
        for (var i in layer.properties.style) {
          var val = layer.properties.style[i];
          if (val == null || val == "") continue;

          var valDef = def.style[i];
          if (valDef == val) continue;

          if (geojson.properties.style == null)
            geojson.properties.style = {};
          geojson.properties.style[i] = val;
        }
        for (var i in layer.properties.attr) {
          var val = layer.properties.attr[i];
          if (val == null || val == "") continue;

          var valDef = def.attr[i];
          if (valDef == val) continue;

          if (geojson.properties.attr == null)
            geojson.properties.attr = {};
          geojson.properties.attr[i] = val;
        }

        features.push(geojson);
      }
      var featureCollection = { type: "FeatureCollection", features: features }

      var json = isJsonObj?featureCollection: JSON.stringify(featureCollection);
      return json;
    },
    jsonToLayer: function (json, isClear) {
      this.stopDraw();
      if (this.options.isOnly) this.clearDraw();

      var geojson = JSON.parse(json);

      var layerResult = L.geoJSON(geojson);
      var layers = layerResult.getLayers();
      if (layers.length == 0) {
        return 0;
      }

      if (isClear)
        this.layerDraw.clearLayers();

      for (var index = 0; index < layers.length; index++) {
        var item = layers[index];
        item.feature.properties=item.feature.properties||{};

        var attr = item.feature.properties;
        if (attr.style == null) attr.style = {};
        if (attr.attr == null) attr.attr = {};
        if(attr.type==null){
          switch(item.feature.geometry.type){
            default:
            case 'Point':
            case 'MultiPoint':
              attr.type="marker";
              break;
            case 'LineString':
            case 'MultiLineString':
              attr.type="polyline";
              break;
            case 'Polygon':
            case 'MultiPolygon':
              attr.type="polygon";
              break;
          }
        }

        //赋默认值
        var def = this.configDefval[attr.type];
        for (var i in def.style) {
          var val = attr.style[i];
          if (val != null) continue;

          attr.style[i] = def.style[i];
        }
        for (var i in def.attr) {
          var val = attr.attr[i];
          if (val != null) continue;

          attr.attr[i] = def.attr[i];
        }

        switch (attr.type) {
          case "circle":
            var layer = L.circle(item.getLatLng(), { radius: attr.style.radius });
            item = layer;
            break;
          case "rectangle":
            var layer = L.rectangle(item.getBounds());
            item = layer;
            break;
          case "image":
            var layer = L.rectangle(item.getBounds(), this.control['image']._defstyle);
            item = layer;
            break;
        }

        item.properties = attr;
        item.feature = null;
        this.layerDraw.addLayer(item);

        this.updateProperties(item);//更新样式
      }
      return layers;
    },


    //从plot的config/attr.json 拷贝，方便读取
    configDefval: {},
    iniDefVal: function () {

      for (var i in this.config) {
        var cfg = this.config[i];

        var defstyle = {};
        for (var idx = 0; idx < cfg.style.length; idx++) {
          var item = cfg.style[idx];
          defstyle[item.name] = item.defval;
        }
        var defattr = {};
        for (var idx = 0; idx < cfg.attr.length; idx++) {
          var item = cfg.attr[idx];
          defattr[item.name] = item.defval;
        }

        this.configDefval[i] = {
          type: i,
          name: cfg.name,
          style: defstyle,
          attr: defattr
        };
      }

      //console.log(JSON.stringify(this.configDefval));
    },
    config: {
      "text": {
        "name": "文字",
        "style": [
          { "name": "text", "label": "内容", "type": "textarea", "defval": "文字" },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },

          { "name": "color", "label": "颜色", "type": "color", "defval": "#0081c2" },
          { "name": "font_size", "label": "字体大小", "type": "number", "defval": 30 },
          {
            "name": "font_family",
            "label": "字体",
            "type": "combobox",
            "defval": "黑体",
            "data": [
              { "text": "黑体", "value": "黑体" },
              { "text": "宋体", "value": "宋体" },
              { "text": "微软雅黑", "value": "微软雅黑" }
            ]
          },
          {
            "name": "font_style",
            "label": "是否斜体",
            "type": "combobox",
            "defval": "normal",
            "data": [
              { "text": "是", "value": "italic" },
              { "text": "否", "value": "normal" }
            ]
          },
          {
            "name": "font_weight",
            "label": "是否加粗",
            "type": "combobox",
            "defval": "normal",
            "data": [
              { "text": "是", "value": "bold" },
              { "text": "否", "value": "normal" }
            ]
          },
          { "name": "background", "label": "是否背景", "type": "radio", "defval": false, "impact": [ "background_color" ] },
          { "name": "background_color", "label": "背景颜色", "type": "color", "defval": "#ccc" },

          { "name": "border", "label": "是否边框", "type": "radio", "defval": false, "impact": [ "border_color", "border_width", "border_style" ] },
          { "name": "border_color", "label": "边框颜色", "type": "color", "defval": "#5928de" },
          { "name": "border_width", "label": "边框宽度", "type": "number", "defval": 3 },
          {
            "name": "border_style",
            "label": "边框样式",
            "type": "combobox",
            "defval": "solid",
            "data": [
              { "text": "实线", "value": "solid" },
              { "text": "双实线", "value": "double" },
              { "text": "3D凹槽", "value": "groove" },
              { "text": "菱形", "value": "ridge" },
              { "text": "3D凹", "value": "inset" },
              { "text": "3D凸", "value": "outset" }
            ]
          }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "font-marker": {
        "name": "字体图标点",
        "style": [
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },

          { "name": "size", "label": "大小", "type": "number", "defval": 50 },
          { "name": "color", "label": "颜色", "type": "color", "defval": "#000000" },
          { "name": "iconClass", "label": "字体class", "type": "hidden", "defval": "fa fa-crosshairs" }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "marker": {
        "name": "点标记",
        "style": [
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },
          { "name": "iconUrl", "label": "图标", "type": "label", "defval": "" },
          { "name": "iconSize0", "label": "宽度", "type": "number", "defval": 25 },
          { "name": "iconSize1", "label": "高度", "type": "number", "defval": 41 },
          { "name": "iconAnchor0", "label": "锚点left", "type": "number", "defval": 12 },
          { "name": "iconAnchor1", "label": "锚点top", "type": "number", "defval": 41 }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "polyline": {
        "name": "线",
        "style": [
          { "name": "color", "label": "颜色", "type": "color", "defval": "#3388ff" },
          { "name": "weight", "label": "线宽", "type": "number", "defval": 3 },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },
          {
            "name": "dashArray",
            "label": "线型",
            "type": "combobox",
            "defval": "",
            "data": [
              { "text": "实线", "value": "" },
              { "text": "虚线", "value": "5, 10" },
              { "text": "虚点线", "value": "1, 5" },
              { "text": "点画线1", "value": "5, 5, 1, 5" },
              { "text": "点画线2", "value": "15, 10, 5, 10" }
            ]
          }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "polylinefree": {
        "name": "自由线",
        "style": [
          { "name": "color", "label": "颜色", "type": "color", "defval": "#3388ff" },
          { "name": "weight", "label": "线宽", "type": "number", "defval": 3 },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },
          {
            "name": "dashArray",
            "label": "线型",
            "type": "combobox",
            "defval": "",
            "data": [
              { "text": "实线", "value": "" },
              { "text": "虚线", "value": "5, 10" },
              { "text": "虚点线", "value": "1, 5" },
              { "text": "点画线1", "value": "5, 5, 1, 5" },
              { "text": "点画线2", "value": "15, 10, 5, 10" }
            ]
          }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "polygon": {
        "name": "面",
        "style": [
          { "name": "stroke", "label": "是否边框", "type": "radio", "defval": true, "impact": [ "color", "weight", "opacity", "dashArray" ] },
          { "name": "color", "label": "线颜色", "type": "color", "defval": "#3388ff" },
          { "name": "weight", "label": "线宽", "type": "number", "defval": 2 },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },
          {
            "name": "dashArray",
            "label": "线型",
            "type": "combobox",
            "defval": "",
            "data": [
              { "text": "实线", "value": "" },
              { "text": "虚线", "value": "5, 10" },
              { "text": "虚点线", "value": "1, 5" },
              { "text": "点画线1", "value": "5, 5, 1, 5" },
              { "text": "点画线2", "value": "15, 10, 5, 10" }
            ]
          },
          { "name": "fill", "label": "是否填充", "type": "radio", "defval": true, "impact": [ "fillColor", "fillOpacity" ] },
          { "name": "fillColor", "label": "填充颜色", "type": "color", "defval": "#3388ff" },
          { "name": "fillOpacity", "label": "填充透明度", "type": "slider", "defval": 0.3 }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "rectangle": {
        "name": "矩形",
        "style": [
          { "name": "stroke", "label": "是否边框", "type": "radio", "defval": true, "impact": [ "color", "weight", "opacity", "dashArray" ] },
          { "name": "color", "label": "线颜色", "type": "color", "defval": "#3388ff" },
          { "name": "weight", "label": "线宽", "type": "number", "defval": 2 },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },
          {
            "name": "dashArray",
            "label": "线型",
            "type": "combobox",
            "defval": "",
            "data": [
              { "text": "实线", "value": "" },
              { "text": "虚线", "value": "5, 10" },
              { "text": "虚点线", "value": "1, 5" },
              { "text": "点画线1", "value": "5, 5, 1, 5" },
              { "text": "点画线2", "value": "15, 10, 5, 10" }
            ]
          },
          { "name": "fill", "label": "是否填充", "type": "radio", "defval": true, "impact": [ "fillColor", "fillOpacity" ] },
          { "name": "fillColor", "label": "填充颜色", "type": "color", "defval": "#3388ff" },
          { "name": "fillOpacity", "label": "填充透明度", "type": "slider", "defval": 0.3 }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },
      "circle": {
        "name": "圆",
        "style": [
          { "name": "radius", "label": "半径", "type": "number", "defval": 0 },
          { "name": "stroke", "label": "是否边框", "type": "radio", "defval": true, "impact": [ "color", "weight", "opacity", "dashArray" ] },
          { "name": "color", "label": "线颜色", "type": "color", "defval": "#3388ff" },
          { "name": "weight", "label": "线宽", "type": "number", "defval": 2 },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 },
          {
            "name": "dashArray",
            "label": "线型",
            "type": "combobox",
            "defval": "",
            "data": [
              { "text": "实线", "value": "" },
              { "text": "虚线", "value": "5, 10" },
              { "text": "虚点线", "value": "1, 5" },
              { "text": "点画线1", "value": "5, 5, 1, 5" },
              { "text": "点画线2", "value": "15, 10, 5, 10" }
            ]
          },
          { "name": "fill", "label": "是否填充", "type": "radio", "defval": true, "impact": [ "fillColor", "fillOpacity" ] },
          { "name": "fillColor", "label": "填充颜色", "type": "color", "defval": "#3388ff" },
          { "name": "fillOpacity", "label": "填充透明度", "type": "slider", "defval": 0.3 },

          { "name": "isSemicircle", "label": "是否扇形", "type": "radio", "defval": false, "impact": [ "startAngle", "stopAngle" ] },
          { "name": "startAngle", "label": "开始角度", "type": "number", "defval": 0 },
          { "name": "stopAngle", "label": "结束角度", "type": "number", "defval": 0 }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      },

      "image": {
        "name": "图片",
        "style": [
          { "name": "iconUrl", "label": "路径", "type": "label", "defval": "" },
          { "name": "opacity", "label": "透明度", "type": "slider", "defval": 1 }
        ],
        "attr": [
          { "name": "name", "label": "名称", "type": "text", "defval": "" },
          { "name": "remark", "label": "备注", "type": "textarea", "defval": "" }
        ]
      }
    }


  };
  that.init();

  return that;
});


var MeasureTool = L.Class.extend({
    map: null,

    initialize: function (options) {
        options = options || {};

        this.map = options.map;
        this._create();

        if (!options.hasOwnProperty('isactivate') || options.options)
            this.activate();
    },
    layerDraw: null,
    polylineControl: null,
    polygonControl: null,
    iconDot: null,
    //初始化[仅执行1次]
    _create: function () {
        this.layerDraw = L.featureGroup().addTo(this.map);

        var style = { color: '#0000ff', weight: 2 };
        var iconDot = L.divIcon({
            className: "",
            html: '<div style="background: #ffffff;border-radius: 50%;border: #0000ff 2px solid;width:100%;height:100%;"></div>',
            iconSize: [10, 10]
        });

        this.polylineControl = new L.Draw.Polyline(this.map, {
            shapeOptions: style,
            icon: iconDot, touchIcon: iconDot
        });
        this.polygonControl = new L.Draw.Polygon(this.map, {
            allowIntersection: false,
            showArea: true,
            metric: ['km', 'm'],
            icon: iconDot, touchIcon: iconDot,
            shapeOptions: style
        });
        this.iconDot = iconDot;
    },
    isActivate: false,
    //激活插件
    activate: function () {
        if (this.isActivate) {
            return;
        }
        this.isActivate = true;

        this.map.addLayer(this.layerDraw);

        this.map.on('dblclick', this._map_dblclickHndler, this);
        this.map.on('draw:created', this._map_draw_createdHndler, this);
        this.map.on("draw:drawvertex", this._map_draw_drawvertexHandler, this);

        this.map.on("draw:drawing", this._map_draw_drawing, this);
        //this.map.on("draw:editing", this._map_draw_editing, this);
    },
    //释放插件
    disable: function () {
        this.isActivate = false;

        this.clear();
        this.map.removeLayer(this.layerDraw);

        this.map.off('dblclick', this._map_dblclickHndler, this);
        this.map.off('draw:created', this._map_draw_createdHndler, this);
        this.map.off("draw:drawvertex", this._map_draw_drawvertexHandler, this);
        this.map.off("draw:drawing", this._map_draw_drawing, this);
        //this.map.off("draw:editing", this._map_draw_editing, this);
    },
    clear: function () {
        this._stopDraw();
        this._last_length_val = 0;
        this._last_area_val = 0;
        this._length_tipmarker = [];
        this._area_tipmarker = [];

        this.layerDraw.clearLayers();
        return this;
    },
    _stopDraw: function () {
        this.polylineControl.disable();
        this.polygonControl.disable();
    },
    _drawType: "",
    _drawParams: null,
    measureLength: function (param) {
        this._drawType = "length";
        this._drawParams = param;

        this._stopDraw();
        this.polylineControl.enable();
        return this;
    },
    measureArea: function (param) {
        this._drawType = "area";
        this._drawParams = param;

        this._stopDraw();
        this.polygonControl.enable();
        return this;
    },
    _map_draw_drawvertexHandler: function (event) {
        var dots = event.layers.getLayers();

        var result = {};
        if (this._drawType == "length") {
            var latlngs = [];
            for (var i = 0; i < dots.length; i++) {
                var dot = dots[i];
                var latlng = dot.getLatLng();
                latlngs.push(latlng);

                if (!dot.tipMarker) {
                    dot.tipMarker = this._showLengthTipMarker(latlngs);
                }
            }
            this._showResultLength(latlngs);
        }
        else if (this._drawType == "area") {
            var latlngs = [];
            for (var i = 0; i < dots.length; i++) {
                var dot = dots[i];
                var latlng = dot.getLatLng();
                latlngs.push(latlng);
            }
            this._showResultArea(latlngs);
        }
    },
    _map_draw_createdHndler: function (event) {
        var layer = event.layer;
        this.layerDraw.addLayer(layer);

        if (event.layerType == "polyline") {
            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                var pointMarker = L.marker(latlngs[i], { icon: this.iconDot });
                this.layerDraw.addLayer(pointMarker);
            }
            this._showResultLength(latlngs);

            var tipMarker = this._length_tipmarker[this._length_tipmarker.length - 1];
            tipMarker._isend = true;
            tipMarker._icon.innerHTML = "总长：" + tipMarker._icon.innerHTML;
        }
        else if (event.layerType == "polygon") {
            var latlngs = layer.getLatLngs()[0];
            for (var i = 0; i < latlngs.length; i++) {
                var pointMarker = L.marker(latlngs[i], { icon: this.iconDot });
                this.layerDraw.addLayer(pointMarker);
            }
            this._showResultArea(latlngs);
            this._showAreaTipMarker(layer);
        }

        if (this._drawParams && this._drawParams.drawend) {
            this._drawParams.drawend();
        }
    },
    _map_dblclickHndler: function (e) {
        L.DomEvent.stopPropagation(e); //停止冒泡
        if (this.polygonControl._enabled && this.polygonControl._finishShape) {
            this.polygonControl._finishShape();
        }
    },

    //
    _map_draw_drawing: function (e) {
        var layer = e.layer;
        var latlng = e.latlng;

        if (layer instanceof L.Polyline) {
            var latlngs = layer.getLatLngs().concat([latlng]);
            if (latlngs.length < 2) return;

            if (this._drawType == "length")
                this._showResultLength(latlngs);
            else
                this._showResultArea(latlngs);
        }

    },



    //长度测量结果
    _formatLength: function (val,danwei) {
        var valstr = "";

        if(danwei==null){
            if (this._drawParams && this._drawParams.unit) {
                if (typeof (this._drawParams.unit) == "function")
                    danwei = this._drawParams.unit();
                else
                    danwei = this._drawParams.unit;
            }
            else {
                if (val < 1000)
                    danwei = "3";
                else
                    danwei = "1";
            }
        }


        switch (danwei) {
            case "1":
            case "km":
                valstr = (val * 0.001).toFixed(2) + ' 公里';
                break;
            case "2":
            case "mile":
                valstr = (val * 0.00054).toFixed(2) + ' 海里';
                break;
            default:
            case "3":
            case "m":
                valstr = val.toFixed(0) + ' 米';
                break;
            case "4":
            case "zhang":
                valstr = (val * 0.3).toFixed(2) + ' 丈';
                break;
        }
        return valstr;
    },
    _length_tipmarker: [],
    _showLengthTipMarker: function (latlngs) {
        //显示每个线段提示
        var text;
        var length;
        if (latlngs.length == 1) {
            length = 0;
            text = "起点";
        }
        else {
            length =measure.length(latlngs);
            text = this._formatLength(length);
        }

        var tipMarker = L.marker(latlngs[latlngs.length - 1], {
            icon: L.divIcon({
                className: "leaflet-measuretool-result",
                html: text,
                iconSize: [null, 25],
                iconAnchor: [-20, 12]
            })
        }).addTo(this.layerDraw);
        tipMarker._length = length;

        if (latlngs.length != 1)
            this._length_tipmarker.push(tipMarker);

        return tipMarker;
    },
    updateLengthUnit: function (danwei) {
        for (var i = 0; i < this._length_tipmarker.length; i++) {
            var tipMarker = this._length_tipmarker[i];
            var text = this._formatLength(tipMarker._length,danwei);

            if (tipMarker._isend)
                tipMarker._icon.innerHTML = "总长：" + text;
            else
                tipMarker._icon.innerHTML = text;
        }
    },
    _last_length_val: 0,
    _showResultLength: function (latlngs) {
        this._last_length_val = measure.length(latlngs);
        var text = this._formatLength(this._last_length_val);

        if (this._drawParams && this._drawParams.showResult && typeof (this._drawParams.showResult) == "function")
            this._drawParams.showResult(text, this._last_length_val);
    },

    //面积测量结果
    _formatArea: function (val,danwei) {
        var valstr = "";

        if(danwei==null){
            if (this._drawParams && this._drawParams.unit) {
                if (typeof (this._drawParams.unit) == "function")
                    danwei = this._drawParams.unit();
                else
                    danwei = this._drawParams.unit;
            }
            else {
                if (val < 1000000)
                    danwei = "2";
                else
                    danwei = "1";
            }
        }

        switch (danwei) {
            case "1":
            case "km":
                valstr = (val / 1000000).toFixed(2) + ' 平方公里';
                break;
            default:
            case "2":
            case "m":
                valstr = val.toFixed(0) + ' 平方米';
                break;
            case "3":
            case "mu":
                valstr = (val * 0.0015).toFixed(2) + ' 亩';
                break;
            case "4":
            case "ha":
                valstr = (val * 0.0001).toFixed(2) + ' 公顷';
                break;
        }
        return valstr;
    },
    _area_tipmarker: [],
    _showAreaTipMarker: function (polygon) {
        var latlng = polygon.getCenter();
        var text = this._formatArea(this._last_area_val);

        var tipMarker = L.marker(latlng, {
            icon: L.divIcon({
                className: "leaflet-measuretool-result",
                html: text,
                iconSize: [null, 25],
                iconAnchor: [(text.length * 10) / 2, 12]
            })
        }).addTo(this.layerDraw);
        tipMarker._area = this._last_area_val;

        this._area_tipmarker.push(tipMarker);

        return tipMarker;
    },
    updateAreaUnit: function (danwei) {
        for (var i = 0; i < this._area_tipmarker.length; i++) {
            var tipMarker = this._area_tipmarker[i];
            var text = this._formatArea(tipMarker._area,danwei);
            tipMarker._icon.innerHTML = text;
        }
    },
    _last_area_val: 0,
    _showResultArea: function (latlngs) {
        this._last_area_val =measure.area(latlngs);
        var text = this._formatArea(this._last_area_val);

        if (this._drawParams && this._drawParams.showResult && typeof (this._drawParams.showResult) == "function")
            this._drawParams.showResult(text, this._last_area_val);
    }
});
var measure = {
    //计算长度
    length: function (coords) {
        if (typeof coords.getLatLngs == 'function') {
            coords = coords.getLatLngs();
        }
        if (coords.length === 0) return 0;

        var total = 0;
        for (var i = 0, n = coords.length - 1; i < n; i++) {
            total += coords[i].distanceTo(coords[i + 1]);
        }
        return total;
    },
    lengthstr: function (coords) {
        return this.lengthFormat(this.length(coords));
    },
    lengthFormat: function (len) {
        if (len > 1000)
            return (len / 1000).toFixed(2) + "公里";
        else
            return len.toFixed(0) + "米";
    },
    geodesicArea: function (coords) {
        return this.area(coords);
    },
    //计算面积
    area: function (coords) {
        if (typeof coords.getLatLngs == 'function') {
            coords = coords.getLatLngs();
        }

        var len = coords.length;
        if (len == 1) {
            coords = coords[0];
            len = coords.length;
        }
        if (len == undefined || len < 3) return 0;

        var area = 0.0, p1, p2;
        var x1 = coords[len - 1].lng;
        var y1 = coords[len - 1].lat;

        for (var i = 0; i < len; i++) {
            var x2 = coords[i].lng, y2 = coords[i].lat;

            area += this.toRadians(x2 - x1) *
                (2 + Math.sin(this.toRadians(y1)) +
                    Math.sin(this.toRadians(y2)));
            x1 = x2;
            y1 = y2;
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;

        return Math.abs(area);
    },
    toRadians: function (angleInDegrees) {
        return angleInDegrees * Math.PI / 180;
    },
    areastr: function (coords) {
        return this.areaFormat(this.area(coords));
    },
    areaFormat: function (area) {
        if (area >= 1000000) {
            return (area / 1000000).toFixed(2) + '平方公里';
        }
        else {
            return area.toFixed(0) + '平方米';
        }
    },

    //计算角度【像素坐标，latlng通过map.latLngToContainerPoint 转换下】
    getAngle: function (pt1, pt2) {
        if (!pt1 || !pt2) return 0;

        var dx = pt2.x - pt1.x;
        var dy = pt2.y - pt1.y;

        //特殊
        if (dx == 0) {
            if (dy == 0) return 0;
            if (dy > 0) return 90;
            if (dy < 0) return 270;
        }

        var arc = Math.atan(dy / dx);
        var a = (arc / Math.PI) * 180;

        //第二、三象限
        if (dx <= 0) {
            a = a + 180;
        }

        //第四象限
        if (dx > 0 && dy < 0) {
            a = a + 360;
        }

        return Number(a.toFixed(0));
    },

};
//测量工具
L.mars.MeasureTool = (function (opt) {
    return new MeasureTool(opt);
});
