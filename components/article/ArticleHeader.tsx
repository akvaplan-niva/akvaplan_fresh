type ArticleHeaderProps = {
  header: string;
  image?: string;
  imageCaption?: string;
};

const _caption = {
  fontSize: "0.75rem",
};

//console.log("@todo ArticleHeader should not be repeated in markup");
//https://dev.to/mustapha/responsive-images-for-better-performance-start-using-srcset-and-picture-11kc
//https://web.dev/use-srcset-to-automatically-choose-the-right-image/#summary
//todo use srcset 746 https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_746,ar_16:9/phiscaik9w3oqbjvabdr
export default function ArticleHeader({
  header,
  image,
  imageCaption,
}: ArticleHeaderProps) {
  return (
    <>
      <section class="article-title-mobile" aria-disabled="true">
        <h1>{header}</h1>
      </section>
      <header class="article-header">
        <img
          title={imageCaption}
          alt={imageCaption}
          src={image}
          width="1024"
          height="576"
          style="transition: opacity 12s ease-in-out;"
        />
        <h1>
          <span class="backdrop-blur">{header}</span>
        </h1>
      </header>
      <figure style={_caption}>
        <figcaption>{imageCaption}</figcaption>
      </figure>
    </>
  );
}
