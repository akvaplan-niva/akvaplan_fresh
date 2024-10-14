import { NVA_API, nvaPublicationLanding } from "akvaplan_fresh/services/nva.ts";
import { Signal, useSignal } from "@preact/signals";
import { Head, IS_BROWSER } from "$fresh/runtime.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import pub from "akvaplan_fresh/routes/pub.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { boolean } from "@valibot/valibot";

interface NvaPublicationLike {
  identifier: string;
  entityDescription: {
    abstract?: string;
    description?: string;
  };
  associatedArtifacts: NvaArtifactLike[];
}
interface NvaArtifactLike {
  identifier: string;
  type: string;
  mimeType: string;
}

const fetchNvaPublication = async (identifier: string) => {
  const url = new URL(`/publication/${identifier}`, NVA_API);
  console.warn(url.href);
  return await fetch(url, { headers: { accept: "application/json" } });
};

const getPresignedPdfUrl = async (id: string, file: string) => {
  const url = new URL(`/download/public/${id}/files/${file}`, NVA_API);
  const res = await fetch(url);
  if (res?.ok) {
    const { presignedDownloadUrl } = await res.json();
    return presignedDownloadUrl;
  }
};

const pdfFilter = (
  { type, mimeType }: NvaArtifactLike,
) => mimeType === "application/pdf" && type === "PublishedFile";

export const PubNvaPdfAugment = (
  { publication, identifier = publication?.identifier, lang }: {
    publication?: NvaPublicationLike;
    identifier?: string;
    lang: string;
  },
) => {
  const id = "pub-nva-pdf-" + crypto.randomUUID();
  const state = useSignal({ ready: false, querySelector: "#" + id } as {
    ready: boolean;
    querySelector: string;
    abstract?: string;
    description?: string;
  });

  langSignal.value = lang;

  const createPdfAug = (
    parent: Element,
    src: string,
    style =
      "height:600px;width:100%;padding-bottom:1.5rem;background:var(--surface1);",
  ) => {
    const embedPdf = document.createElement("embed-pdf");
    embedPdf.setAttribute("src", src);
    embedPdf.setAttribute("style", style);
    parent?.appendChild(embedPdf);
  };

  const embedPdfs = (publication: NvaPublicationLike, state: Signal) => {
    const { entityDescription: { abstract, description } } = publication;
    if (abstract) {
      state.value.abstract = abstract;
    }

    publication?.associatedArtifacts?.filter(pdfFilter).map(
      async (file) => {
        const pdfUrl = await getPresignedPdfUrl(
          publication.identifier,
          file.identifier,
        );
        const embed = document.querySelector(state.value.querySelector);
        if (embed && pdfUrl) {
          createPdfAug(embed, pdfUrl);
        }
      },
    );
    state.value.ready = true;
  };

  const getPublicationAndEmbedPdfs = async (
    identifier: string,
    state: Signal,
  ) => {
    const r = await fetchNvaPublication(identifier);
    if (r.ok) {
      const publication = await r.json();
      embedPdfs(publication, state);
    }
  };

  if (IS_BROWSER && state.value.ready === false) {
    if (publication) {
      embedPdfs(publication, state);
    } else if (identifier) {
      getPublicationAndEmbedPdfs(identifier, state);
    }
  }

  return (
    <>
      <Head>
        <script
          src="https://deno.land/x/embed_pdf@v1.3.0/mod.js"
          type="module"
        >
        </script>
      </Head>

      {identifier && (
        <p>
          {t("pubs.View_in")}{" "}
          <a href={nvaPublicationLanding(identifier)} target="_blank">
            {t("NVA")}
          </a>
        </p>
      )}
      <div
        id={id}
      />

      {state.value?.abstract && (
        <Section>
          <h2>{t("Abstract")}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: state.value?.abstract }}
            style={{ maxWidth: "120ch", fontSize: "1rem" }}
          />
        </Section>
      )}

      {state.value?.description &&
        (
          <Section>
            <h2>{t("Description")}</h2>
            <p
              dangerouslySetInnerHTML={{ __html: state.value?.description }}
              style={{ maxWidth: "120ch", fontSize: "1rem" }}
            />
          </Section>
        )}
    </>
  );
};
