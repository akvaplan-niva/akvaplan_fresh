// Locations from https://nominatim.openstreetmap.org/ui/search.html?street=&city=&country=Norway&postalcode=&accept-language=no
const Alta = ["Alta", [23.27543, 69.96680]];
const Bergen = ["Bergen", [5.323333, 60.3925]];
const Bodø = ["Bodø", [14.38168, 67.28514]];
const Oslo = ["Oslo", [10.79256, 59.92467]];
const Reykjavík = ["Reykjavík", [-21.8955, 64.1458]];
const Ski = ["Ski", [10.83753, 59.71973]];
const Sortland = ["Sortland", [15.41674, 68.69460]];
const Stord = ["Stord", [5.4967, 59.7875]];
const Tromsø = ["Tromsø", [18.948428, 69.643641]];
const Trondheim = ["Trondheim", [10.40279, 63.44106]];

export const toFeature = ([name, coordinates]) => ({
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": coordinates,
  },
  "properties": { where: name },
});

export const hq = [Tromsø].map(toFeature);
export const nonHq = [
  Alta,
  Bergen,
  Bodø,
  Oslo,
  Reykjavík,
  Sortland,
  Ski,
  Stord,
  Trondheim,
]
  .map(
    toFeature,
  );

export const nameToCoord = new Map([
  Alta,
  Bergen,
  Bodø,
  Oslo,
  Reykjavík,
  Ski,
  Sortland,
  Stord,
  Tromsø,
  Trondheim,
]);
