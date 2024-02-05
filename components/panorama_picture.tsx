export const mynewsdeskPanoramaImageUrl = (
  { id, ar, w }: { id: string; ar: string; w: number },
) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_${w},ar_${ar}/${id}`;

export const MynewsdeskPanoramaPicture = ({ id }: { id: string }) => (
  <picture>
    <source
      media="(min-width: 1024px)"
      srcset={mynewsdeskPanoramaImageUrl({ id, w: 1782, ar: "3:1" })}
    />
    <source
      media="(max-width: 1023px)"
      srcset={mynewsdeskPanoramaImageUrl({ id, w: 1024, ar: "3:1" })}
    />
    <img
      src={mynewsdeskPanoramaImageUrl({ id, w: 1782, ar: "3:1" })}
      alt=""
    />
  </picture>
);
