import { Card } from "./card.tsx";
import { SlimPublication } from "@/@interfaces/slim_publication.ts";
import { doiImage } from "@/services/doi_augment.ts";
export function SlimCard(
  props: { slim: SlimPublication; n: number; lang: string },
) {
  const {
    title,
    doi,
    container,
    printed,
    type,
    published,
    license,
    pdf,
    cites,
    authors,
  } = props.slim;
  const { n, lang } = props;
  return (
    <li>
      <Card>
        <header>
          <a
            href={`/${lang}/doi/${doi}`}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </header>{" "}
        <p
          style={{
            fontSize: "1rem",
            display: "grid",
            gridTemplateColumns: "12ch 1fr",
          }}
        >
          <span>
            <time>{published}</time>
          </span>
          <span>
            <em dangerouslySetInnerHTML={{ __html: container }} />
            {" "}
          </span>
        </p>
      </Card>
    </li>
  );
}
/* {authors.map(({ family }, n) => (
            <span>{family}{n === authors.length - 1 ? null : ", "}</span>
          ))}.*/
