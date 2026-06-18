import { Pill } from "@/components/button/pill.tsx";

const removeHref = ({ intl, img512 }) => {
  return { document: { intl, img512 } };
};

const randomIndex = (arr: unknown[], max = arr.length - 1, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const name = ({ intl, title }, lang) => {
  const name = intl && intl.name && intl.name[lang] ? intl.name[lang] : title;
  return name;
};

const ServicesHits = ({ hits, lang, onSelect }) => (
  <ol
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    }}
  >
    {hits?.map(({ score, document }, i) => (
      <Pill onClick={onSelect} data-index={i}>
        {name(document, lang)}
      </Pill>
    ))}
  </ol>
);

// export default function ListSelector({ list, services, title }: Props) {
//   const heroIndex = useSignal(0);

//   const onSelect = ({ target: { dataset: { index } } }) => {
//     heroIndex.value = index;
//   };

//   return (
//     <div
//       style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}
//       onClick={(e) => {
//         console.warn(e);
//         heroIndex.value += 1;
//       }}
//     >
//       <SearchResults hits={services} display="grid" />
//       <section className="dynamic-image-hscroll">
//         <img
//           className="dynamic-image-big"
//           src={list.at(heroIndex.value)?.img}
//         />
//         <div className="_dynamic-scroll-details">
//           {
//             /* <section class="article-title-mobile" aria-disabled="true">
//             <h1></h1>
//           </section> */
//           }
//           {
//             /* <header class="article-header">
//             <h1>
//               <span class="backdrop-blur">
//               </span>
//             </h1>
//           </header> */
//           }
//         </div>
//         <div className="dynamic-scroll-container">
//         </div>
//         <Head>
//           <link rel="stylesheet" href={asset("/css/hscroll-dynamic.css")} />
//         </Head>
//       </section>

//       <ServicesHits
//         hits={removePublished(services)}
//         lang={"no"}
//         display={"grid"}
//         count={9}
//         onSelect={onSelect}
//       />
//     </div>
//   );
// }
