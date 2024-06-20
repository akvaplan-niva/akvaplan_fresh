const alta: Office = {
  name: "Alta",
  addr: {
    post: "Markveien 38b, 9510 Alta",
    visit: "Markedsgata 3, 9510 Alta",
  },
  tel: "+47 41 67 68 29",
  email: "alta@akvaplan.niva.no",
};

const bergen: Office = {
  name: "Bergen",
  email: "bergen@akvaplan.niva.no",
  tel: "+47 45 03 56 57",
  addr: {
    post: "Thormøhlensgata 53d, 5006 Bergen",
    visit: "Thormøhlensgata 53d, 5006 Bergen",
  },
};

const bodø: Office = {
  name: "Bodø",
  email: "apnbodo@akvaplan.niva.no",
  tel: "+47 77 75 03 00",
  addr: {
    post: "c/o Salmon Center, Sjøgata 21, 3.etg, 8006 Bodø",
    visit: "c/o Salmon Center, Sjøgata 21, 3.etg, 8006 Bodø",
  },
};

const oslo: Office = {
  name: "Oslo",
  email: "oslo@akvaplan.niva.no",
  tel: "+47 94 84 93 12",
  addr: {
    post: "Økernveien 94, 0579 Oslo",
    visit: "Økernveien 94, 0579 Oslo",
  },
};

const reykjavík: Office = {
  name: "Reykjavík",
  addr: {
    visit: "Akralind 4, 201 Kópavogur, Ísland",
    post: "Akralind 4, 201 Kópavogur, Ísland",
  },
  country: "IS",
  tel: "+354 56 25 80 0",
  tel2: "+354 69 10 70 7",
  email: "iceland@akvaplan.niva.no",
  links: { map: "https://goo.gl/maps/JYinWtgSLpqRcEXs6" },
};

const ski: Office = {
  name: "Ski",
  addr: {
    visit: "Idrettsveien 6, 1400 Ski",
    post: "Idrettsveien 6, 1400 Ski",
  },
  tel: "+47 92 80 41 93",
  email: "sense@akvaplan.niva.no",
};

const stord: Office = {
  name: "Stord",
  addr: {
    visit: "Kunnskapshuset, Sæ 132, 5417 Stord",
    post: "Kunnskapshuset, Sæ 132, 5417 Stord",
  },
  tel: "+47 91 85 08 34",
  email: "sense@akvaplan.niva.no",
};

const trondheim: Office = {
  name: "Trondheim",
  addr: {
    post: "Postboks 1268, Sluppen, 7462 Trondheim",
    visit: "Pirsenteret, Havnegata 9, 7010 Trondheim",
  },
  country: "NO",
  tel: "+47 99 58 54 68",
  email: "trondheim@akvaplan.niva.no",
  links: {},
};

export const tromsø: Office = {
  name: "Tromsø",
  tel: "+47 77 75 03 00",
  email: "info@akvaplan.niva.no",
  country: "NO",
  hq: true,
  addr: {
    visit: "Framsenteret, 9296 Tromsø",
    post: "Framsenteret, Postboks 6606, Stakkevollan, 9296 Tromsø",
  },
};

export const sortland: Office = {
  name: "Sortland",
  tel: "",
  email: "",
  addr: {
    visit: "Torggata 15, c/o Smia Cowork, 8400 Sortland",
    post: "Torggata 15, c/o Smia Cowork, 8400 Sortland",
  },
};
interface Addr {
  post: string;
  visit: string;
}

interface Office {
  addr: Addr;
  name: string;
  tel: string;
  email: string;
  country?: string;
  hq?: true | undefined;
}

export const offices = new Map<string, Office>([
  ["Alta", alta],
  ["Bergen", bergen],
  ["Bodø", bodø],
  ["Oslo", oslo],
  ["Reykjavík", reykjavík],
  ["Ski", ski],
  //["Stord", stord],
  ["Sortland", sortland],
  ["Tromsø", tromsø],
  ["Trondheim", trondheim],
]);
