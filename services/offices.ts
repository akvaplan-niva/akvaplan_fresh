interface Office {
  name: string;
  country: "NO" | "IS";
  tel: string;
  //tel2?: string;
  visit?: string;
  post: string;
  email: string;
  hq?: true | undefined;
}
const alta: Office = {
  name: "Alta",
  country: "NO",
  post: "Markveien 38b, 9510 Alta",
  visit: "Markedsgata 3, 9510 Alta",
  tel: "+47 41 67 68 29",
  email: "alta@akvaplan.niva.no",
};

const bergen: Office = {
  name: "Bergen",
  country: "NO",
  email: "bergen@akvaplan.niva.no",
  tel: "+47 45 03 56 57",
  post: "Thormøhlensgata 53d, 5006 Bergen",
};

const bodø: Office = {
  name: "Bodø",
  country: "NO",
  email: "apnbodo@akvaplan.niva.no",
  tel: "+47 77 75 03 00",
  post: "c/o Salmon Center, Sjøgata 21, 3.etg, 8006 Bodø",
};

const oslo: Office = {
  name: "Oslo",
  country: "NO",
  email: "oslo@akvaplan.niva.no",
  tel: "+47 94 84 93 12",
  post: "Økernveien 94, 0579 Oslo",
};

const reykjavík: Office = {
  name: "Reykjavík",
  country: "IS",
  post: "Akralind 4, 201 Kópavogur, Ísland",
  tel: "+354 56 25 80 0",
  //tel2: "+354 69 10 70 7",
  email: "iceland@akvaplan.niva.no",
  //links: { map: "https://goo.gl/maps/JYinWtgSLpqRcEXs6" },
};

const ski: Office = {
  name: "Ski",
  country: "NO",
  post: "Idrettsveien 6, 1400 Ski",
  tel: "+47 92 80 41 93",
  email: "sense@akvaplan.niva.no",
};

const stord: Office = {
  name: "Stord",
  country: "NO",
  post: "Kunnskapshuset, Sæ 132, 5417 Stord",
  tel: "+47 91 85 08 34",
  email: "sense@akvaplan.niva.no",
};

const trondheim: Office = {
  name: "Trondheim",
  country: "NO",
  post: "Postboks 1268, Sluppen, 7462 Trondheim",
  visit: "Pirsenteret, Havnegata 9, 7010 Trondheim",
  //tel: "",
  email: "trondheim@akvaplan.niva.no",
};

export const tromsø: Office = {
  name: "Tromsø",
  tel: "+47 77 75 03 00",
  email: "info@akvaplan.niva.no",
  country: "NO",
  hq: true,
  visit: "Framsenteret",
  post: "Postboks 6606, Stakkevollan, 9296 Tromsø",
};

export const sortland: Office = {
  name: "Sortland",
  tel: "+ 47 47 88 72 94",
  email: "fma@akvaplan.niva.no",
  post: "Torggata 15, c/o Smia Cowork, 8400 Sortland",
  country: "NO",
};

export const offices = new Map<string, Office>([
  ["Alta", alta],
  ["Bergen", bergen],
  ["Bodø", bodø],
  ["Oslo", oslo],
  ["Reykjavík", reykjavík],
  ["Ski", ski],
  ["Sortland", sortland],
  ["Stord", stord],
  ["Tromsø", tromsø],
  ["Trondheim", trondheim],
]);
