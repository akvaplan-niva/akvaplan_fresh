// Adapted from
// https://maplibre.org/maplibre-gl-js/docs/examples/geojson-markers/
import maplibregl from "https://esm.sh/maplibre-gl@4.4.1/dist/maplibre-gl.js";

import { nameToCoord, toFeature } from "./office_coordinates.js";

const getOfficeName = () => {
  const el = document.querySelector("[data-office]");
  if (el) {
    const { dataset: { office } } = el;
    return office;
  }
};

const getCenter = () => {
  const name = getOfficeName();
  return nameToCoord.has(name) ? nameToCoord.get(name) : [9, 64.5];
};

const style = {
  "version": 8,
  "sources": {
    "osm": {
      "type": "raster",
      "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      "tileSize": 256,
      "attribution": "&copy; OpenStreetMap Contributors",
      "maxzoom": 19,
    },
  },
  "layers": [
    {
      "id": "osm",
      "type": "raster",
      "source": "osm", // This must match the source key above
    },
  ],
};

const mapConfig = {
  container: "map",
  style,
  center: getCenter(),
  zoom: 14,
  dragPan: true,
};

const createIconImageLayerProps = (id, marker, size) => ({
  id,
  "type": "symbol",
  "source": id,
  "layout": {
    "icon-image": marker,
    "icon-size": size,
  },
});

const createOfficeMap = async (config) => {
  const map = new maplibregl.Map(config);

  const name = getOfficeName();
  const coordinates = nameToCoord.get(name);
  const features = [toFeature([name, coordinates])];

  const symbol = await map.loadImage(
    `/akvaplan_symbol_dark.png`,
  );
  const logo = symbol;

  map.on("load", () => {
    map.addImage("logo-marker", logo.data);

    map.addImage("symbol-marker", symbol.data);

    map.addSource("offices-layer", {
      "type": "geojson",
      data: { "type": "FeatureCollection", features: [] },
    });

    map.addSource("hq-layer", {
      "type": "geojson",
      data: {
        "type": "FeatureCollection",
        features,
      },
    });

    // map.addLayer(
    //   createIconImageLayerProps("offices-layer", "symbol-marker", 0.125),
    // );
    map.addLayer(createIconImageLayerProps("hq-layer", "logo-marker", 0.15));
  });
};

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    createOfficeMap(mapConfig);
  }
};
