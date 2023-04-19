//矢量数据图层
var vectorLayer;
//数据类型
var ajaxDataType;
//地图投影坐标系
var projection = ol.proj.get('EPSG:3857');
//proj4.defs("EPSG:2435", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

/**
*矢量几何要素的默认样式
*/
var image = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 1 })
});

var gaodeMapLayer = new ol.layer.Tile({
    title: "高德地图",
    source: new ol.source.XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false
    })
});

var styles = {
    'Point': [
        new ol.style.Style({
            //点样式
            image: image
        })
    ],
    'LineString': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //线的边界样式
                color: 'green',
                width: 1
            })
        })
    ],
    'MultiLineString': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //多线的边界样式
                color: 'green',
                width: 1
            })
        })
    ],
    'MultiPoint': [
        new ol.style.Style({
            //多点的点样式
            image: image
        })
    ],
    'MultiPolygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //多区的边界样式
                color: 'yellow',
                width: 1
            }),
            fill: new ol.style.Fill({
                //多区的填充样式
                color: 'rgba(255, 255, 0, 0.1)'
            })
        })
    ],
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(0, 0, 255, 0.1)'
            })
        })
    ],
    'GeometryCollection': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //集合要素的边界样式
                color: 'magenta',
                width: 2
            }),
            fill: new ol.style.Fill({
                //集合要素的填充样式
                color: 'magenta'
            }),
            image: new ol.style.Circle({
                //集合要素的点样式
                radius: 10,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: 'magenta'
                })
            })
        })
    ],
    'Circle': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //圆的边界样式
                color: 'red',
                width: 2
            }),
            fill: new ol.style.Fill({
                //圆的填充样式
                color: 'rgba(255,0,0,0.2)'
            })
        })
    ]
};

//绿地和山体的样式
var Greenstyles = {
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'rgba(0, 255, 0, 0.4)',
                lineDash: [6],
                width: 2
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(0, 255, 0, 0.05)'
            })
        })
    ],
}

//建筑物的样式
var Buildingstyles = {
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'rgba(255, 0, 0, 0.8)',
                width: 2
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(255, 0, 0, 0.1)'
            })
        })
    ],
}

//运动场的样式
var Sportstyles = {
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'rgba(0, 255, 255, 0.8)',
                width: 2
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(0, 255, 255, 0.1)'
            })
        })
    ],
}

//水体的样式
var Waterstyles = {
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'rgba(0, 0, 255, 0.4)',
                lineDash: [6],
                width: 2
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(0, 0, 255, 0.05)'
            })
        })
    ],
}

//其他开阔地样式
var OpenAreastyles = {
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'rgba(255, 0, 255, 0.4)',
                width: 2
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(255, 0, 255, 0.05)'
            })
        })
    ],
}

//道路样式
var Roadstyles = {
    'LineString': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //线的边界样式
                color: 'black',
                width: 2
            })
        })
    ],
};

var styleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return styles[feature.getGeometry().getType()];
};

var GreenstyleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return Greenstyles[feature.getGeometry().getType()];
};

var BuildingstyleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return Buildingstyles[feature.getGeometry().getType()];
};

var WaterstyleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return Waterstyles[feature.getGeometry().getType()];
};

var SportstyleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return Sportstyles[feature.getGeometry().getType()];
};

var OpenAreastyleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return OpenAreastyles[feature.getGeometry().getType()];
};

var RoadstyleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return Roadstyles[feature.getGeometry().getType()];
};

//实例化比例尺控件（ScaleLine）
var scaleLineControl = new ol.control.ScaleLine({
    //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
    units: "metric"
});

// 保存地图交互
const defaultInteractions = ol.interaction.defaults();

//实例化Map对象加载地图
var map = new ol.Map({
    layers: [],
    view: new ol.View({
        center: [12731001.24409, 3572609.85467],
        projection: 'EPSG:3857',
        zoom: 16,
        minZoom: 1
    }),
    target: 'mapCon',
    controls: [new ol.control.MousePosition()]//显示鼠标指针的X、Y坐标
});

//投影转换,本程序中已经离线完成该步骤，无需在加载时转换，但为便于加载其他数据，保留该接口
function transformCoordinates(geojson, sourceProj, targetProj) {
    var source = proj4(sourceProj);
    var target = proj4(targetProj);

    function transformPoint(coordinates) {
        return proj4(source, target, coordinates);
    }

    function processGeometry(geometry) {
        if (geometry.type === 'Point') {
            geometry.coordinates = transformPoint(geometry.coordinates);
        } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
            geometry.coordinates = geometry.coordinates.map(transformPoint);
        } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
            geometry.coordinates = geometry.coordinates.map(ring => ring.map(transformPoint));
        } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates = geometry.coordinates.map(polygon => polygon.map(ring => ring.map(transformPoint)));
        }
    }

    function processFeature(feature) {
        processGeometry(feature.geometry);
    }

    if (geojson.type === 'FeatureCollection') {
        geojson.features.forEach(processFeature);
    } else if (geojson.type === 'Feature') {
        processFeature(geojson);
    } else {
        processGeometry(geojson);
    }

    return geojson;
}

async function loadGeoJSON(url, needsTransform) {
    const response = await fetch(url);
    const json = await response.json();

    if (needsTransform) {
        const sourceProjection = "EPSG:2435";
        const targetProjection = "EPSG:3857";
        transformCoordinates(json, sourceProjection, targetProjection);
    }

    return json;
}

/**
* 将矢量几何要素显示到地图中
* @param {String} type 数据类型
* @param {String} data 数据的url地址
*/
async function loadVectData() {
    if (vectorLayer != null || vectorLayer == "undefined") {
        //移除已有矢量图层
        map.removeLayer(vectorLayer);
    }

    const buildingsGeoJSON = await loadGeoJSON("../../data/Buildings.geojson", false);
    const buildingFeatures = new ol.format.GeoJSON().readFeatures(buildingsGeoJSON);
    // 为要素设置 feature_type 属性
    buildingFeatures.forEach(feature => {
        feature.set('feature_type', 'Building');
    });
    //添加矢量数据源
    const vectorSource = new ol.source.Vector({
        features: buildingFeatures
    });

    const RoadGeoJSON = await loadGeoJSON("../../data/Roads.geojson", false);
    const RoadFeatures = new ol.format.GeoJSON().readFeatures(RoadGeoJSON);
    // 为要素设置 feature_type 属性
    RoadFeatures.forEach(feature => {
        feature.set('feature_type', 'Road');
    });
    //添加矢量数据源
    const vectorSource2 = new ol.source.Vector({
        features: RoadFeatures
    });

    const GreenlandGeoJSON = await loadGeoJSON("../../data/Greenland.geojson", false);
    const GreenlandFeatures = new ol.format.GeoJSON().readFeatures(GreenlandGeoJSON);
    // 为要素设置 feature_type 属性
    GreenlandFeatures.forEach(feature => {
        feature.set('feature_type', 'Greenland');
    });
    //添加矢量数据源
    const vectorSource3 = new ol.source.Vector({
        features: GreenlandFeatures
    });

    const OpenAreasJSON = await loadGeoJSON("../../data/OpenAreas.geojson", false);
    const OpenAreasFeatures = new ol.format.GeoJSON().readFeatures(OpenAreasJSON);
    // 为要素设置 feature_type 属性
    OpenAreasFeatures.forEach(feature => {
        feature.set('feature_type', 'OpenArea');
    });
    //添加矢量数据源
    const vectorSource4 = new ol.source.Vector({
        features: OpenAreasFeatures
    });

    const SportfieldsJSON = await loadGeoJSON("../../data/Sportfields.geojson", false);
    const SportfieldsFeatures = new ol.format.GeoJSON().readFeatures(SportfieldsJSON);
    // 为要素设置 feature_type 属性
    SportfieldsFeatures.forEach(feature => {
        feature.set('feature_type', 'Sportfield');
    });
    //添加矢量数据源
    const vectorSource5 = new ol.source.Vector({
        features: SportfieldsFeatures
    });

    const WaterJSON = await loadGeoJSON("../../data/Water.geojson", false);
    const WaterFeatures = new ol.format.GeoJSON().readFeatures(WaterJSON);
    // 为要素设置 feature_type 属性
    WaterFeatures.forEach(feature => {
        feature.set('feature_type', 'Water');
    });
    //添加矢量数据源
    const vectorSource6 = new ol.source.Vector({
        features: WaterFeatures
    });

    const MountainJSON = await loadGeoJSON("../../data/Mountain.geojson", false);
    const MountainFeatures = new ol.format.GeoJSON().readFeatures(MountainJSON);
    // 为要素设置 feature_type 属性
    MountainFeatures.forEach(feature => {
        feature.set('feature_type', 'Mountain');
    });
    //添加矢量数据源
    const vectorSource7 = new ol.source.Vector({
        features: MountainFeatures
    });

    vectorLayer = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource,
        //样式设置
        style: BuildingstyleFunction
    });

    vectorLayer2 = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource2,
        //样式设置
        style: RoadstyleFunction
    });

    vectorLayer3 = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource3,
        //样式设置
        style: GreenstyleFunction
    });

    vectorLayer4 = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource4,
        //样式设置
        style: OpenAreastyleFunction
    });

    vectorLayer5 = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource5,
        //样式设置
        style: SportstyleFunction
    });

    vectorLayer6 = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource6,
        //样式设置
        style: WaterstyleFunction
    });

    vectorLayer7 = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource7,
        //样式设置
        style: GreenstyleFunction
    });

    //将矢量图层加载到地图中
    map.addLayer(vectorLayer);
    map.addLayer(vectorLayer2);
    map.addLayer(vectorLayer3);
    map.addLayer(vectorLayer4);
    map.addLayer(vectorLayer5);
    map.addLayer(vectorLayer6);
    map.addLayer(vectorLayer7);

    //获取地图视图
    var view = map.getView();
    //地图缩放
    view.setZoom(16);
}

loadVectData();
