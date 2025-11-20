import { set } from "@hyperjump/json-pointer";
import { useSignal } from "@preact/signals";
import Button from "akvaplan_fresh/components/button/button.tsx";

import type {
  Panel,
  PanelImage,
  PanelIntl,
} from "akvaplan_fresh/@interfaces/panel.ts";

import { FieldSetOfObject } from "akvaplan_fresh/islands/FieldSetOfObject.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "../../time/intl.ts";
import KvTextInput, { TextArea } from "../KvTextInput.tsx";

const core: (keyof Panel)[] = [];
//const cover: (keyof PanelImage)[] = ["cloudinary", "url"];
const ids: (keyof PanelImage)[] = [];

const intl: (keyof PanelIntl)[] = []; //"title", "href", "intro", "cta", "desc"];

const schema = {
  core: core.map((name) => ({ name })),
  ids: ids.map((name) => ({ name })),

  intl: intl.map((name) => ({ name })),
  //intl,
} as const;

const bool = ["/backdrop"];
const number = ["/position"];
const textarea = ["/intl/desc"];

export const panelTemplate = {
  id: undefined,
};

export const ProjectEditIsland = (
  { project, lang, url }: { key: Deno.KvKey; panel: Panel; lang: string },
) => {
  project.created = project?.created ?? project?.updated ?? project?.modified;
  if (!project.title) {
    project.title = { en: "", no: "" };
  }
  if (!project.summary) {
    project.summary = { en: "", no: "" };
  }
  const p = useSignal({ ...panelTemplate, ...project });
  const patches = useSignal([]);
  const statusText = useSignal("");

  const sendPatch = async () => {
    const body = JSON.stringify({ project: p.value, patches: patches.value });
    console.warn("PATCH", url, body);
    const res = await fetch(url, {
      method: "PATCH",
      body,
    });
    if (res?.ok) {
      const { versionstamp, ok } = await res.json() as {
        versionstamp: string;
        ok: boolean;
      };
      if (ok) {
        statusText.value = `Saved changes: ${
          patches.value.map((p) => p.path).join("\n")
        } at ${p.value.updated}`;
      } else {
        statusText.value = "Failed saving";
      }
    }
  };

  const applyPatch = (op, path, value) => {
    const modified = new Date().toJSON();
    if (bool.includes(path)) {
      value = value === "false" ? false : true;
    }
    const withModified = { ...p.value, modified };
    p.value = set(path, withModified, value);

    patches.value = [...patches.value, { op, path, value }];
  };

  const handleInput = async (e: Event) => {
    e.preventDefault();

    if (e.target) {
      const { value, dataset } = e.target;
      applyPatch(dataset.op ?? "replace", dataset.path, value);
      await sendPatch();
    }
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    await sendPatch();
  };

  return (
    <form onSubmit={onSubmit} onChange={handleInput} method="post" action={url}>
      <fieldset style={{ border: 0 }}>
        <legend>naming</legend>
        <KvTextInput
          label={"shortname"}
          data-op="replace"
          name={"abbr"}
          value={p?.value.abbr}
          data-path={`/abbr`}
        />

        {["en", "no"].map((lang) => (
          <KvTextInput
            label={`title [${lang}]`}
            value={p?.value.title[lang]}
            data-path={`/title/${lang}`}
          />
        ))}
      </fieldset>
      <fieldset style={{ border: 0 }}>
        <legend>period</legend>
        <KvTextInput
          label={`start`}
          name={"start"}
          value={isodate(p?.value.start)}
          data-path={`/start`}
          type="date"
        />

        <KvTextInput
          label={"end"}
          name={"end"}
          value={isodate(p?.value.end)}
          data-path={`/end`}
          type="date"
        />
      </fieldset>

      <fieldset style={{ border: 0 }}>
        <legend>summary</legend>

        {["en", "no"].map((lang) => (
          <TextArea
            label={`summary [${lang}]`}
            data-op="replace"
            value={p?.value.summary[lang]}
            data-path={`/summary/${lang}`}
          />
        ))}
      </fieldset>

      <FieldSetOfObject
        fields={schema.core.map(({ name }) =>
          name
        )}
        legend={t("")}
        path={``}
        object={p.value}
      />

      <FieldSetOfObject
        fields={[
          "akvaplanists",
          "cloudinary",
          "cristin",
          "fhf",
          "mynewsdesk",
          "rcn",
        ]}
        legend={t("ui.ids")}
        path={``}
        object={p.value}
      />

      {project.id !== null &&
        (
          <FieldSetOfObject
            fields={[
              "id",
              "published",
              "created",
              "updated",
            ]}
            path={``}
            legend={t("ui.internal")}
            object={p.value}
            disabled
          />
        )}

      {project.id === null
        ? <Button name="_btn" type="submit" value="new" filled>Create</Button>
        : <Button name="_btn" type="submit" value="save" filled>Save</Button>}

      <output>{statusText}</output>
    </form>
  );
};
