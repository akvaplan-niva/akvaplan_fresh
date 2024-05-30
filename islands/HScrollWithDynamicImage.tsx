import { useState } from "preact/hooks";
import { HScroll } from "akvaplan_fresh/components/mod.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { asset } from "$fresh/runtime.ts";

type Image = {
  img: string;
  href: string;
  title: string;
};

type Props = {
  scrollerId: string;
  images: Image[];
};

type ScrollImageProps = {
  image: Image;
  onHover: () => void;
};

export const ScrollImage = ({ image, onHover }: ScrollImageProps) => {
  return (
    <div
      className="scroll-image"
      _onMouseEnter={() => setTimeout(onHover, 100)}
    >
      <a class="image-container" href={image.href}>
        <img
          width={400}
          height={400}
          loading="lazy"
          src={image.img512
            ? image.img512.replace("/preview/", "/thumbnail_big/")
            : image.img}
          alt={image.name}
          title={image.name}
        />
      </a>
    </div>
  );
};

export default function HScrollWithDynamicImage({ images }: Props) {
  const [bigImage, setBigImage] = useState(images.at(0));
  console.warn(bigImage);
  //if (!bigImage) return null;

  const onHover = (e) => {
    console.warn(e);
  };
  const header = "";

  return (
    <section className="dynamic-image-hscroll">
      <img className="dynamic-image-big" src={bigImage.img} />
      <div className="dynamic-scroll-details">
        <section class="article-title-mobile" aria-disabled="true">
          <h1></h1>
        </section>
        <header class="article-header">
          <h1>
            <span class="backdrop-blur">{header}</span>
          </h1>
        </header>
      </div>
      <div className="dynamic-scroll-container">
        <HScroll scrollerId={crypto.randomUUID()} _maxVisibleChildren={5}>
          {images.map((image) => (
            <ScrollImage
              image={image}
              onHover={onHover}
            />
          ))}
        </HScroll>
      </div>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll-dynamic.css")} />
      </Head>
    </section>
  );
}
