import Button from "akvaplan_fresh/components/button/button.tsx";
import { asset, Head } from "$fresh/runtime.ts";

import { WideImage } from "./wide_image.tsx";
import { ApnLogo } from "akvaplan_fresh/components/mod.ts";
import { EditIconButton } from "akvaplan_fresh/components/edit_icon_button.tsx";
import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";
import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";

// FIXME Panel: refactor markup/css
// FIXME Panel: support left-right-cemter text/cta, center eg: https://codepen.io/sflinz/pen/dvEbwz
export function PictureOverlay({
  title,
  upper,
  cta,
  image,
  theme,
  backdrop,
  maxHeight,
}) {
  return (
    <div>
      <figure>
        <figcaption
          style={{
            fontSize: ".75rem",
            display: "grid",
            justifyContent: "end",
          }}
        >
          {image?.caption}
        </figcaption>
      </figure>

      <header class="mega-header" color-scheme={theme}>
        <WideImage {...image} style={{ maxHeight }} />

        <h2 class="mega-heading backdrop-blur">{title}</h2>

        <p class="wide-image-card-upper"></p>

        {upper && (
          <p class="mega-upper">
            {upper}
          </p>
        )}
        {cta && (
          <span class="cta">
            {cta}
          </span>
        )}
      </header>
    </div>
  );
}

// FIXME MegaCard Use CloudinaryPicture cor multiple resolutions
export const ImagePanel = (
  {
    upper,
    title,
    href,
    image,
    cta,
    theme,
    backdrop,
    intro,
    id,
    lang,
    maxHeight,
    editor = false,
    ...props
  },
) => (
  <a href={href} class="mega-card" {...props}>
    <Head>
      <link rel="stylesheet" href={asset("/css/article.css")} />
    </Head>
    <PictureOverlay
      upper={upper ?? intro}
      cta={cta
        ? (
          <Button filled>
            {cta}
          </Button>
        )
        : null}
      image={image}
      title={title}
      theme={theme}
      backdrop={backdrop}
      maxHeight={maxHeight}
    />
    <div
      aria-disabled="true"
      class="mega-mobile-upper"
      style={{ marginBottom: "0.25rem", padding: "0.25rem" }}
    >
      <h3
        style={{
          fontSize: "var(--font-size-4)",
          color: "var(--text1)",
          fontWeight: 900,
        }}
      >
        {title}
      </h3>
      <p
        style={{ fontSize: "0.75rem" }}
      >
        {upper}
      </p>
    </div>
    <EditIconButton
      authorized={editor === true}
      href={`/${lang}/panel/${id}/edit`}
    />
  </a>
);

function WidePictureOverlay({
  title,
  upper,
  image,
  theme,
  backdrop,
  sizes,
}) {
  return (
    <div>
      <figure>
        <figcaption
          style={{
            fontSize: ".75rem",
            display: "grid",
            justifyContent: "end",
          }}
        >
          {image?.caption ?? ""}
        </figcaption>
      </figure>

      <header class="mega-header" color-scheme={theme}>
        <WideImage {...image} sizes={sizes} />
        <p class="wide-image-card-upper">
          {backdrop ? <span class="backdrop-blur">{upper}</span> : upper}
        </p>

        <h3 class="wide-image-card-lower wide-image-card-title">
          {backdrop ? <span class="backdrop-blur">{title}</span> : title}
        </h3>
      </header>
    </div>
  );
}

export const ArticlePanelTitleLow = (
  { title, href, upper, image, theme, backdrop },
) => (
  <a href={href} class="mega-card">
    <Head>
      <link rel="stylesheet" href={asset("/css/article.css")} />
    </Head>
    <WidePictureOverlay
      image={image}
      title={title}
      upper={upper}
      theme={theme}
      backdrop={backdrop}
    />
    <div
      class="wide-image-card-lower-mobile"
      style={{ marginBottom: "0.25rem", padding: "0.25rem" }}
    >
      <h3
        style={{
          fontSize: "var(--font-size-4)",
          color: "var(--text1)",
          fontWeight: 900,
        }}
      >
        {title}
      </h3>
      <p>{upper}</p>
    </div>
  </a>
);

export const WideCard = (
  { title, href, image, theme, sizes },
) => (
  <a href={href} class="mega-card" title={title}>
    <Head>
      <link rel="stylesheet" href={asset("/css/article.css")} />
    </Head>
    <WidePictureOverlay
      image={image}
      title=""
      upper=""
      theme={theme}
      sizes={sizes}
    />
    <p
      style={{
        textAlign: "left",
        fontWeight: "normal",
        fontSize: "var(--font-size-fluid-0,0.75rem)",
        wordBreak: "break-word",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {title}
    </p>
  </a>
);

export const HeroPanel = (
  {
    image,
    lang,
    title,
    theme,
    backdrop,
    id,
    editor = false,
    children,
    ...props
  },
) => (
  <header class="wide-image-card" {...props} color-scheme={theme}>
    <WideImage
      {...image}
      style={{ width: "100%", maxHeight: "50dvh", borderRadius: 0 }}
    />

    <div
      class="wide-image-card-upper-always"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "0.5rem",
        fontSize: "var(--size-fluid-4)",
        fontWeight: "900",
      }}
    >
      <a href={`/${lang}`}>
        <ApnLogo width="192" color-scheme={"dark"} />
      </a>
      {backdrop ? <span class="backdrop-blur">{title}</span> : title}
      <EditIconButton
        authorized={editor === true}
        href={`/${lang}/panel/${id}/edit`}
      />
    </div>
    <div class="wide-image-card-lower-always"></div>
    <Head>
      <link rel="stylesheet" href={asset("/css/article.css")} />
    </Head>
  </header>
);

export const NewPanel = ({ collection, lang }) => (
  <BentoPanel
    panel={{
      title: null,
      id: null,
      image: { cloudinary: "snlcxc38hperptakjpi5" },
    }}
    editor={true}
    hero={false}
    href={`/${lang}/panel/_/new?collection=${collection}`}
  />
);

export const buildPanelListItem = ({ lang, editor, w, ar }) =>
(
  { intl, id, image, href = editor ? `${id}/edit` : id },
) => (
  <li
    style={{
      fontSize: "1rem",
      margin: "1px",
      background: "var(--surface0)",
    }}
  >
    <a
      style={{
        placeContent: "center",
        display: "grid",
        gap: "1.5rem",
        padding: ".25rem",
        gridTemplateColumns: "auto 1fr",
      }}
      href={href}
    >
      <img
        width={w}
        height={w}
        alt={""}
        src={image?.cloudinary?.length > 0
          ? cloudinaryUrl(image?.cloudinary, { ar, w })
          : image.url}
      />
      <span style={{ placeContent: "center" }}>
        {intl[lang].title}
      </span>
    </a>
  </li>
);
