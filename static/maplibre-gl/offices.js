// Adapted from
// https://maplibre.org/maplibre-gl-js/docs/examples/geojson-markers/
import maplibregl from "https://esm.sh/maplibre-gl@4.4.1/dist/maplibre-gl.js";
import { CARTO_BASEMAPS } from "./CARTO_BASEMAPS.js";

// Locations from https://nominatim.openstreetmap.org/ui/search.html?street=&city=&country=Norway&postalcode=&accept-language=no
const Alta = ["Alta", [23.27543, 69.96680]];
const Bergen = ["Bergen", [5.323333, 60.3925]];
const Bodø = ["Bodø", [14.38168, 67.28514]];
const Oslo = ["Oslo", [10.79256, 59.92467]];
const Reykjavík = ["Reykjavík", [-21.8955, 64.1458]];
const Ski = ["Ski", [10.83753, 59.71973]];
const Sortland = ["Sortland", [15.41674, 68.69460]];
const Tromsø = ["Tromsø", [18.948428, 69.643641]];
const Trondheim = ["Trondheim", [10.40279, 63.44106]];

const toFeature = ([name, coordinates]) => ({
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": coordinates,
  },
  "properties": { where: name },
});

const hq = [Tromsø].map(toFeature);
const nonHq = [Alta, Bergen, Bodø, Oslo, Trondheim, Reykjavík, Ski, Sortland]
  .map(
    toFeature,
  );

const map = new maplibregl.Map({
  container: "map",
  style: CARTO_BASEMAPS.DARK_MATTER_NOLABELS,
  center: [13.5, 64.5],
  zoom: 3.5,
});
// Shared name display popup
const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: true,
});
const logo = await map.loadImage(
  // works: "data:image/png;base64,iVBOR
  `/akvaplan_symbol_dark.png`,
);
const symbol = await map.loadImage(
  `/akvaplan_symbol_dark.png`,
);

const popupHtml = (f, lang) =>
  `<div color-scheme="light" style="font-family: Roboto Flex, sans-serif;
     color: var(--text1); 
     background: var(--surface1);
     font-size: 1rem;
     font-weight: 700;
  ">
  <a href="/${lang}/folk/workplace/${f.properties.where}">${f.properties.where}</a>
</div>`;

map.on("load", () => {
  map.addImage("logo-marker", logo.data);

  map.addImage("symbol-marker", symbol.data);

  map.addSource("offices-layer", {
    "type": "geojson",
    data: { "type": "FeatureCollection", features: nonHq },
  });

  map.addSource("hq-layer", {
    "type": "geojson",
    data: { "type": "FeatureCollection", features: hq },
  });

  const createIconImageLayerProps = (id, marker, size) => ({
    id,
    "type": "symbol",
    "source": id,
    "layout": {
      "icon-image": marker,
      "icon-size": size,
    },
  });

  map.addLayer(
    createIconImageLayerProps("offices-layer", "symbol-marker", 0.125),
  );
  map.addLayer(createIconImageLayerProps("hq-layer", "logo-marker", 0.3));

  const onHoverShowPopup = (e) => {
    map.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    const { pathname } = new URL(document.URL);
    const lang = pathname.slice(1, 3);
    popup.setLngLat(coordinates).setHTML(
      popupHtml(e.features[0], lang),
    ).addTo(map);
  };

  map.on("mouseenter", "offices-layer", onHoverShowPopup);

  map.on("mouseenter", "hq-layer", onHoverShowPopup);
});
