<template>
  <div class="hello">
    <div id="map" class="map"></div>
    <div id="info">&nbsp;</div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import KML from "ol/format/KML";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import BingMaps from "ol/source/BingMaps";
import VectorSource from "ol/source/Vector";
import { eventBus } from "../main";
export default {
  data() {
    return {};
  },
  created() {
    eventBus.$on("kmlUpload", kml => {
      console.log("MAP", kml);
      this.mapLoad(kml);
    });
  },
  mounted() {
    // this.mapLoad();
  },
  methods: {
    mapLoad(kml) {
      var layerList = [];
      var raster = new TileLayer({
        source: new BingMaps({
          imagerySet: "Aerial",
          key:
            "As1HiMj1PvLPlqc_gtM7AqZfBL8ZL3VrjaS3zIb22Uvb9WKhuJObROC-qUpa81U5"
        })
      });
      layerList.push(raster);
      kml.forEach(element => {
        layerList.push(new VectorLayer({
          source: new VectorSource({
            url: "http://pyh8k7w0c.bkt.clouddn.com/"+element,
            format: new KML()
          })
        }));
        console.log('layerList',layerList);
      });

      var map = new Map({
        layers: layerList,
        target: document.getElementById("map"),
        view: new View({
          projection: "EPSG:4326", //使用这个坐标系
          center: [114.064839, 22.548857], //深圳
          zoom: 12
        })
      });
      var displayFeatureInfo = function(pixel) {
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature) {
          features.push(feature);
        });
        if (features.length > 0) {
          var info = [];
          var i, ii;
          for (i = 0, ii = features.length; i < ii; ++i) {
            info.push(features[i].get("name"));
          }
          document.getElementById("info").innerHTML =
            info.join(", ") || "(unknown)";
          map.getTarget().style.cursor = "pointer";
        } else {
          document.getElementById("info").innerHTML = "&nbsp;";
          map.getTarget().style.cursor = "";
        }
      };
      map.on("pointermove", function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
      });
      map.on("click", function(evt) {
        displayFeatureInfo(evt.pixel);
      });
    }
  }
};
</script>

<style>
.map {
  height: 400px;
  width: 100%;
}
.ol-layer canvas {
  left: 0;
}
</style>
