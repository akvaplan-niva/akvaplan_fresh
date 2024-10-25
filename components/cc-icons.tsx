import { t } from "akvaplan_fresh/text/mod.ts";

// https://creativecommons.org/share-your-work/cclicenses/
// deno-fmt-ignore
const licenses = new Set([
  "BY", "BY SA", "BY NC", "BY NC SA", "BY ND", "BY NC ND", "ZERO",
]);

const ccByUrl = (license: keyof typeof licenses) =>
  `https://creativecommons.org/licenses/${
    license.toLowerCase().split(" ").join("-")
  }/4.0/`;

const ccImgSrc = (license: string) => `/icon/cc/${license.toLowerCase()}.svg`;

const CCImg = ({ license }) => (
  <img
    src={ccImgSrc(license)}
    alt=""
    title={/cc/i.test(license) ? "Creative Commons" : license}
    style="height: 1.5rem; margin-left: .1rem; vertical-align: text-bottom;"
  />
);

export const CCIcons = ({ code, lang = "en" }) => {
  const [, attributionOrCC0, criteria1, criteria2] = code.split(/[-\s]/).map((
    s,
  ) => s.toUpperCase());
  const license = [attributionOrCC0, criteria1, criteria2].join(" ").trim();

  if (licenses.has(license)) {
    const href = [ccByUrl(license), "deed.", lang].join("");
    return (
      <p
        xmlns:cc="http://creativecommons.org/ns#"
        style={{
          display: "grid",
          alignItems: "center",
          gap: ".25rem",
          gridTemplateColumns: "auto 1fr",
        }}
      >
        <a
          href={href}
          target="_blank"
          rel="license noopener noreferrer"
        >
          <CCImg license={"CC"} />
          <CCImg license={attributionOrCC0} />
          {criteria1 && <CCImg license={criteria1} />}
          {criteria2 && <CCImg license={criteria2} />}
        </a>
        <span>
          {t("pubs.Open_access")}, {license === "ZERO"
            ? t("pubs.marked_public_domain")
            : t("pubs.licensed_under")}{" "}
          <a
            href={href}
            target="_blank"
            rel="license noopener noreferrer"
          >
            {license === "ZERO" ? "CC0" : `CC ${license}`}
          </a>
        </span>
      </p>
    );
  }
  return <span>{license}</span>;
};
