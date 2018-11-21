var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider : Cesium.createTileMapServiceImageryProvider({
        url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    }),
    baseLayerPicker : false,
    geocoder : false,
    shouldAnimate: true,
});

////////////////////////////////////////////////////////
// 此段代码仅为消除锯齿，让录屏好看一点，可以忽略 begin
viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
viewer._cesiumWidget._forceResize = true;
if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    var vtxf_dpr = window.devicePixelRatio;
    // 适度降低分辨率
    while (vtxf_dpr >= 2.0) {
        vtxf_dpr /= 2.0;
    }
    //alert(dpr);
    viewer.resolutionScale = vtxf_dpr;
}
// 此段代码仅为消除锯齿，让录屏好看一点，可以忽略 end
////////////////////////////////////////////////////////

// 设置时间
var start = Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z');
var stop = Cesium.JulianDate.fromIso8601('2019-01-03T00:00:00.00Z');
//Make sure viewer is at the desired time.
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
viewer.clock.multiplier = 50000;
viewer.timeline.zoomTo(start, stop);

// 创建box

var blueBox = viewer.entities.add({
    name : 'Blue box',
    //id: 'blueBox',
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    box : {
        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        material : Cesium.Color.BLUE,
        outline: true,
    },
    path: {
        show: true
    }
});

var redBox = viewer.entities.add({
    name : 'Red box',
    position: Cesium.Cartesian3.fromDegrees(-114.0, 30.0, 300000.0),
    box : {
        dimensions : new Cesium.Cartesian3(200000.0, 200000.0, 200000.0),
        material : Cesium.Color.RED,
        outline: true,
    }
});

viewer.zoomTo(viewer.entities);

Sandcastle.addToolbarButton('Constant new', function () {
    blueBox.box.dimensions = new ConstantProperty(new Cesium.Cartesian3(400000.0, 300000.0, 200000.0));
    // 以上代码等同于
    // blueBox.box.dimensions = new Cesium.Cartesian3(400000.0, 300000.0, 200000.0);
});

Sandcastle.addToolbarButton('Constant set', function () {
    blueBox.box.dimensions.setValue(new Cesium.Cartesian3(400000.0, 300000.0, 700000.0));
});

Sandcastle.addToolbarButton('Sampled', function () {
    var property = new Cesium.SampledProperty(Cesium.Cartesian3);

    property.addSample(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'), 
        new Cesium.Cartesian3(400000.0, 300000.0, 200000.0));
    
    property.addSample(Cesium.JulianDate.fromIso8601('2019-01-03T00:00:00.00Z'), 
        new Cesium.Cartesian3(400000.0, 300000.0, 700000.0));

    blueBox.box.dimensions = property;
});

Sandcastle.addToolbarButton('TimeIntervalCollection', function () {
    var property = new Cesium.TimeIntervalCollectionProperty(Cesium.Cartesian3);

    property.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-01T00:00:00.00Z/2019-01-01T12:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : false,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 200000.0)
    }));
    property.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-01T12:00:01.00Z/2019-01-02T00:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : false,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 400000.0)
    }));
    property.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T00:00:01.00Z/2019-01-02T12:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : false,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
    }));
    property.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T12:00:01.00Z/2019-01-03T00:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : true,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
    }));

    blueBox.box.dimensions = property;
});

Sandcastle.addToolbarButton('Composit', function () {
    // 1 sampledProperty
    var sampledProperty = new Cesium.SampledProperty(Cesium.Cartesian3);
    sampledProperty.addSample(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'), 
        new Cesium.Cartesian3(400000.0, 300000.0, 200000.0));
    
    sampledProperty.addSample(Cesium.JulianDate.fromIso8601('2019-01-02T00:00:00.00Z'), 
        new Cesium.Cartesian3(400000.0, 300000.0, 400000.0));

    // 2 ticProperty
    var ticProperty = new Cesium.TimeIntervalCollectionProperty();
    ticProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T00:00:00.00Z/2019-01-02T06:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : false,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 400000.0)
    }));
    ticProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T06:00:00.00Z/2019-01-02T12:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : false,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
    }));
    ticProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T12:00:00.00Z/2019-01-02T18:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : false,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 600000.0)
    }));
    ticProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T18:00:00.00Z/2019-01-03T23:00:00.00Z',
        isStartIncluded : true,
        isStopIncluded : true,
        data : new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
    }));

    // 3 compositeProperty
    var compositeProperty = new Cesium.CompositeProperty();
    compositeProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-01T00:00:00.00Z/2019-01-02T00:00:00.00Z',
        data : sampledProperty
    }));
    compositeProperty.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
        iso8601 : '2019-01-02T00:00:00.00Z/2019-01-03T00:00:00.00Z',
        isStartIncluded : false,
        isStopIncluded : false,
        data : ticProperty
    }));

    // 4 设置position
    blueBox.box.dimensions = compositeProperty;
});

Sandcastle.addToolbarButton('Reference', function () {
    var collection = viewer.entities;
    redBox.box.dimensions = new Cesium.ReferenceProperty(collection, blueBox.id, ['box', 'dimensions']);
});

Sandcastle.addToolbarButton('PropertyBag', function () {
    var zp = new Cesium.SampledProperty(Number);
    zp.addSample(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'), 200000.0);
    zp.addSample(Cesium.JulianDate.fromIso8601('2019-01-03T00:00:00.00Z'), 700000.0);
    
    blueBox.box.dimensions = new Cesium.PropertyBag({
        x: 400000.0,
        y: 300000.0,
        z: zp
    });
});

Sandcastle.addToolbarButton('ConstantPosition', function () {
    blueBox.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(-114.0, 45.0, 300000.0));
    // 以上代码等同于
    // blueBox.position = Cesium.Cartesian3.fromDegrees(-114.0, 45.0, 300000.0)
});

Sandcastle.addToolbarButton('SampledPosition', function () {
    var property = new Cesium.SampledPositionProperty();

    property.addSample(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'), 
        Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0));
    
    property.addSample(Cesium.JulianDate.fromIso8601('2019-01-03T00:00:00.00Z'), 
        Cesium.Cartesian3.fromDegrees(-114.0, 45.0, 300000.0));

    blueBox.position = property;
});

Sandcastle.addToolbarButton('ColorMaterial', function () {
    blueBox.box.material = new Cesium.ColorMaterialProperty(new Cesium.Color(0, 1, 0));
    // 以上代码等同于
    // blueBox.box.material = new Cesium.Color(0, 1, 0);
});

Sandcastle.addToolbarButton('SampledColor', function () {
    var colorProperty = new Cesium.SampledProperty(Cesium.Color);

    colorProperty.addSample(Cesium.JulianDate.fromIso8601('2019-01-01T00:00:00.00Z'), 
        new Cesium.Color(0, 1, 0));
    
        colorProperty.addSample(Cesium.JulianDate.fromIso8601('2019-01-03T00:00:00.00Z'), 
        new Cesium.Color(0, 0, 1));

    blueBox.box.material = new Cesium.ColorMaterialProperty(colorProperty);
});

