import { Img } from "../routes/images.tsx";

export const AImg = ({ id, href, src, alt = "", n }: Img) => {
  id = id ?? `image-${n}`;
  const loading = n < 11 ? "eager" : "lazy";
  return (
    <a href={href} class="">
      <img
        src={src}
        alt={alt}
        loading={loading}
      />
    </a>
  );
};
