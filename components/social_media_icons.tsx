interface Social {
  icon: string;
  name: string;
  href: string;
  width?: number;
}

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

const akvaplanSocial: Social[] = [x, face, linked, github] as const;

export const SocialMediaIcons = (
  { list = akvaplanSocial }: { lang?: string; list?: Social[] },
) => (
  <>
    {list.map(({ name, icon, href, width }) => (
      <a
        href={href}
        rel="noreferrer noopener"
        target="_blank"
        title={`${name}`}
        class="icon footer__some"
      >
        <img
          src={icon}
          alt={""}
          aria-disabled
          width={width ? String(width) : "24"}
          height="24"
          style={{
            // invert colors
            // => trick to enable visibility on dark backgrounds
            // => nice side-effect is diffusing on light
            filter: "invert(.5)",
          }}
        />
      </a>
    ))}
  </>
);
