import { searchMynewsdesk } from "./mynewsdesk.ts";

import { projectURL } from "./nav.ts";
// import {thumbURL} from "";
import { AbstractMynewsdeskItem, News } from "../@interfaces/mod.ts";

// https://akvaplan.no/en/news/2016-01-26/the-norwegian-ministry-of-foreign-affair-supports-akvaplan-niva-project-by-nok-14.3-million",
// VEIEN http://localhost:7777/en/news/2023-01-30/hvordan-kan-rognkjeks-bli-en-robust-og-effektiv-rensefisk-i-lakseoppdrett

const polarfront = {
  mynewsdesk: {
    id: 104226,
  },
  logo:
    "https://resources.mynewsdesk.com/image/upload/f_auto,t_limit_1000/fptidcnhyeuhbohaggpx.jpg",
  searchwords: ["PolarFront", "polar-front-ecology"],
};
const criptic = {
  logo:
    "https://resources.mynewsdesk.com/image/upload/f_auto,t_limit_1000/icba6p15vg8yhelepmkb.jpg",
};

const slice = {
  exclude: [{ id: 2869616 }],
};

const type_of_media = "event";
export const projectMap = new Map([
  ["polarfront", polarfront],
  ["criptic", criptic],
  ["slice", slice],
]);
const year = ({ datetime } = {}) =>
  datetime ? new Date(datetime).getFullYear() : "????";
export const projectYears = (start_at, end_at) =>
  `${year(start_at)} – ${year(end_at)}`;

export const projectFilter = (item: AbstractMynewsdeskItem) =>
  [type_of_media].includes(item?.type_of_media) &&
  /project|prosjekt/.test(JSON.stringify(item));

// lookup acronym from url?
export const projectFromMynewsdesk = ({ lang }: NewsMapper) =>
(
  {
    language,
    id,
    url,
    image_caption,
    header,
    start_at,
    end_at,
    published_at,
    image,
    type_of_media,
    rels,
    ...item
  }: AbstractMynewsdeskItem,
): News => ({
  id,
  title: header,
  published: published_at.datetime,
  duration: projectYears(start_at, end_at),
  start: start_at?.datetime,
  end: end_at?.datetime,
  href: projectURL({ lang, title: header }),
  hreflang: language,
  img: image,
  caption: image_caption ?? header,
  //thumb: thumbURL(extractID(image ?? "")),
  type: type_of_media,
  rels,
  mynewsdesk: item,
});

export const newsFromProjects =
  ({ lang }) => (myn: AbstractMynewsdeskItem): News => {
    const {
      header,
      image_thumbnail_large,
      language,
      published_at,
      type_of_media,
    } = myn;
    const news: News = {
      title: header,
      //published: new Date("2023-01-07T12:00:00Z"),
      href: projectURL({ lang, title: header }),
      img: myn.image_thumbnail_large,
      type: "project",
    };
    return news;
    // ({
    //   id,
    //   title: header,
    //   published: published_at.datetime,
    //   href: href({ header, language, published_at, type_of_media }, lang),
    //   hreflang: language,
    //   img: image_thumbnail_large, //thumbURL(extractID(image ?? ""), { w: 512, h: 512 }),
    //   caption: image_caption ?? header,
    //   thumb: thumbURL(extractID(image ?? "")),
    //   type: type_of_media,
    //   rels,
    // });
  };
export const latestProjects = async (): Promise<AbstractMynewsdeskItem[]> => {
  const { items } =
    await searchMynewsdesk({ q: "", type_of_media, sort: "" }) ?? { items: [] };
  const projects = items?.filter(projectFilter);
  return projects;
};
