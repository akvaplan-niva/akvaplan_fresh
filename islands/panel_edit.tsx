import { Pointable, set } from "@hyperjump/json-pointer";
import { useSignal } from "@preact/signals";
import Button from "akvaplan_fresh/components/button/button.tsx";

import type {
  Panel,
  PanelImage,
  PanelIntl,
} from "akvaplan_fresh/@interfaces/panel.ts";

import { FieldSetOfObject } from "akvaplan_fresh/islands/FieldSetOfObject.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";

const core: (keyof Panel)[] = ["collection", "theme", "backdrop", "comment"];
const image: (keyof PanelImage)[] = ["cloudinary", "url"];
const intl: (keyof PanelIntl)[] = ["title", "href", "intro", "cta", "desc"];

const schema = {
  core: core.map((name) => ({ name })),
  image: image.map((name) => ({ name })),

  intl: intl.map((name) => ({ name })),
  //intl,
} as const;

const bool = ["/backdrop"];
const number = ["/position"];
export const panelTemplate = {
  id: undefined,
  theme: "dark",
  backdrop: true,
  image: {
    cloudinary: "axo2atkq4zornt8yneyr",
  },
  intl: {
    en: {
      title: "",
      href: "/en",
      cta: "",
    },
    no: {
      title: "",
      href: "/no",
      cta: "",
    },
  },
};

export const PanelEditIsland = (
  { id, panel, lang, url }: { key: Deno.KvKey; panel: Panel; lang: string },
) => {
  const p = useSignal({ ...panelTemplate, ...panel });

  const applyPatch = (op, path, value) => {
    const modified = new Date().toJSON();
    if (bool.includes(path)) {
      value = value === "false" ? false : true;
    }
    const withModified = { ...p.value, modified };
    p.value = set(path, withModified, value);
  };

  const handleInput = ({ target }) => {
    if (target) {
      const { value, dataset } = target;
      return applyPatch(dataset.op, dataset.path, value);
    }
  };

  return (
    <form onChange={handleInput} method="post" action={url}>
      <textarea
        type="text"
        name="_panel"
        hidden
        aria-hidden
        value={JSON.stringify(p.value, null, "  ")}
      />

      {["no", "en"].map((lang) => (
        <FieldSetOfObject
          fields={schema.intl.map(({ name }) => name)}
          legend={t(`lang.${lang}`)}
          path={`/intl/${lang}`}
          object={p.value.intl?.[lang]}
        />
      ))}

      <FieldSetOfObject
        fields={schema.image.map(({ name }) => name)}
        legend={t("ui.image")}
        path={"/image"}
        object={p.value.image}
      />

      <FieldSetOfObject
        fields={schema.core.map(({ name }) => name)}
        legend={t("details")}
        path={``}
        object={p.value}
      />

      <FieldSetOfObject
        fields={["id", "modified"]}
        legend={t("ui.internal")}
        object={panel}
        disabled
      />

      {false && <Button name="_btn" value="publish">Publish</Button>}

      <Button onClick={() => history.back()}>Discard</Button>
      <Button name="_btn" type="submit" value="duplicate">Duplicate</Button>
      <Button name="_btn" type="submit" value="save" filled>Save</Button>
    </form>
  );
};
