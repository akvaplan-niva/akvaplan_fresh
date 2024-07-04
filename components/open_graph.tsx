export const OpenGraphRequired = (
  { title, type, url, image }: {
    title: string;
    type: string;
    url: string;
    image: string;
  },
) => (
  <>
    <meta property="og:title" content={title} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
  </>
);
// <meta property="og:description" content="" />
// <meta property="og:locale" content="en_GB" />
// <meta property="og:locale:alternate" content="no_NO" />
