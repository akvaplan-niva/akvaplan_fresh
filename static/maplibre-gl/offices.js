// Adapted from
// https://maplibre.org/maplibre-gl-js/docs/examples/geojson-markers/
import maplibregl from "https://esm.sh/maplibre-gl@5.6.0/dist/maplibre-gl.js";
import { CARTO_BASEMAPS } from "./CARTO_BASEMAPS.js";
import { hq, nonHq } from "./office_coordinates.js";
const getZoom = () =>
  document.querySelector(":root").clientWidth < 1024 ? 2 : 3.5;

const officesMapConfig = {
  container: "map",
  style: CARTO_BASEMAPS.DARK_MATTER_NOLABELS,
  center: [9, 64.5],
  zoom: getZoom(),
  dragPan: false,
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

const popupHtml = (f, lang) =>
  `<div color-scheme="light" style="font-family: Roboto Flex, sans-serif;
   color: var(--text1); 
   background: var(--surface1);
   font-size: 1rem;
   font-weight: 700;
">
<a href="/${lang}/folk/workplace/${f.properties.where}">${f.properties.where}</a>
</div>`;

const createOfficesMap = async (config) => {
  const map = new maplibregl.Map(config);

  //map.scrollZoom.disable();

  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: true,
  });

  // const logo = await map.loadImage(
  //   // works: "data:image/png;base64,iVBOR
  //   `/akvaplan_logo_dark.png`,
  // );
  const symbol = await map.loadImage(
    `/akvaplan_symbol_dark.png`,
  );
  const logo = symbol;

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

    map.addLayer(
      createIconImageLayerProps("offices-layer", "symbol-marker", 0.125),
    );
    map.addLayer(createIconImageLayerProps("hq-layer", "logo-marker", 0.3));

    const onHoverShowPopup = (e) => {
      map.getCanvas().style.cursor = "pointer";

      const [office] = e?.features ?? [];
      if (office) {
        const { coordinates } = office.geometry;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }
        const { pathname } = new URL(document.URL);
        const lang = pathname.slice(1, 3);
        popup
          .setLngLat(coordinates)
          .setHTML(
            popupHtml(office, lang),
          ).addTo(map);
      }
    };

    map.on("mouseenter", "offices-layer", onHoverShowPopup);

    map.on("mouseenter", "hq-layer", onHoverShowPopup);
  });
};

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    createOfficesMap(officesMapConfig);
  }
};
