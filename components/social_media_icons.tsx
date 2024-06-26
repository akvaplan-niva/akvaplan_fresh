import { Icon } from "akvaplan_fresh/components/icon.tsx";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

interface Social {
  icon: string;
  name: string;
  href: string;
  width?: number;
}
const mail = {
  icon: "mail",
  name: "E-mail",
  href: "mailto:info@akvaplan.niva.no",
};
const phone = {
  icon: "phone_in_talk",
  name: "Ring (8–16)",
  href: "tel:+47 77 75 03 00",
};
const x = {
  icon: "/icon/logo/x.svg",
  name: "X",
  href: "https://x.com/AkvaplanNiva",
};
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

const akvaplanSocial: Social[] = [
  // phone,
  // mail,
  x,
  face,
  linked,
  github,
] as const;

export const SocialMediaIcons = (
  { list = akvaplanSocial, filter = "invert(.5)" }: {
    lang?: string;
    list?: Social[];
    filter?: string;
  },
) => (
  <>
    {list?.map(({ name, icon, href, width, height = width }) => (
      <a
        href={href}
        rel="noreferrer noopener"
        target="_blank"
        title={`${name}`}
        class="icon footer__some"
      >
        {icon.startsWith("/")
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
          : (
            <Icon
              name={icon}
              aria-disabled
              width={width ? String(width) : "24"}
              height={height ? String(height) : "24"}
            />
          )}
      </a>
    ))}
  </>
);

export const buildPersonalSocialMediaLinks = (akvaplanist: Akvaplanist) => {
  const { given, family, openalex, orcid } = akvaplanist;
  const name = `${given} ${family}`;
  return [
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
