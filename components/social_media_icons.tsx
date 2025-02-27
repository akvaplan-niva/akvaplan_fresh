import { Icon } from "akvaplan_fresh/components/icon.tsx";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";
import { NVA_API, NVA_HOME } from "akvaplan_fresh/services/nva.ts";

interface Social {
  icon: string;
  name: string;
  href: string;
  width?: number;
  title?: string;
}
const mail = {
  icon: "mail",
  name: "E-mail",
  href: "mailto:info@akvaplan.niva.no",
};
// const phone = {
//   icon: "phone_in_talk",
//   name: "Ring (8–16)",
//   href: "tel:+47 77 75 03 00",
// };
// const x = {
//   icon: "/icon/logo/x.svg",
//   name: "X",
//   href: "https://x.com/AkvaplanNiva",
// };
const face = {
  name: "Facebook",
  icon: "/icon/logo/facebook.svg",
  href: "https://facebook.com/Akvaplan/",
};
const linked = {
  name: "LinkedIn",
  icon: "/icon/logo/linkedin.svg",
  href: "https://no.linkedin.com/company/akvaplan-niva",
};
const github = {
  name: "GitHub",
  icon: "/icon/logo/github.svg",
  href: "https://github.com/akvaplan-niva",
};
//snap?
//insta?
// const mnd = {
//   name: "Mynewsdesk",
//   icon:
//     "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,h_250,q_auto:good,w_250/kfp8aemln03dgurkwdoz",
//   href: "https://www.mynewsdesk.com/no/stories/organisations?q=akvaplan-niva",
//   filter: "none",
// };
const akvaplanSocial: Social[] = [
  //phone,
  mail,
  //x,
  face,
  linked,
  github,
  //mnd,
] as const;

export const SocialMediaIcons = (
  { list = akvaplanSocial, filter = "invert(.5)" }: {
    lang?: string;
    list?: Social[];
    filter?: string;
  },
) => (
  <>
    {list?.map(({ name, title = name, icon, href, width, height = width }) => (
      <a
        href={href}
        rel="noreferrer noopener"
        target="_blank"
        title={title}
        class="icon footer__some"
      >
        {icon?.startsWith("/") || icon?.startsWith("https://")
          ? (
            <img
              src={icon}
              alt={""}
              aria-disabled
              width={width ? String(width) : "24"}
              height={height ? String(height) : "24"}
              style={{
                // invert colors
                // => trick to enable visibility on dark backgrounds
                // => nice side-effect is diffusing on light
                filter: filter ? filter : undefined,
              }}
            />
          )
          : icon
          ? (
            <Icon
              name={icon}
              aria-disabled
              width={width ? String(width) : "24"}
              height={height ? String(height) : "24"}
            />
          )
          : <span style={{ fontSize: ".75rem" }} title={title}>{name}</span>}
      </a>
    ))}
  </>
);

export const buildPersonalSocialMediaLinks = (akvaplanist: Akvaplanist) => {
  const { given, family, openalex, orcid, cristin } = akvaplanist;
  const name = `${given} ${family}`;
  return [
    cristin &&
    {
      name: `NVA`,
      title: `NVA (${name})`,
      href: new URL(
        `/research-profile?id=${NVA_API}/cristin/person/${cristin}`,
        NVA_HOME,
      ),
    },
    orcid &&
    {
      name: `ORCID (${name})`,
      href: `https://orcid.org/${orcid}`,
      "icon": "/icon/logo/orcid.svg",
    },
    openalex &&
    {
      name: `OpenAlex (${name})`,
      href: `https://openalex.org/authors/${openalex}`,
      "icon": "/icon/logo/openalex.png",
    },
  ].filter((ident) => ![undefined, null].includes(ident));
};
