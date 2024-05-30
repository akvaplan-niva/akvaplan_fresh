import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import KvTextInput from "akvaplan_fresh/islands/KvTextInput.tsx";

import {
  coerce,
  nullable,
  object,
  optional,
  Output,
  safeParse,
  startsWith,
  string,
  toTrimmed,
} from "@valibot/valibot";

import { defineRoute } from "$fresh/src/server/defines.ts";

const Error = ({ message, details }) => (
  <details>
    <summary>
      {message}:{" "}
      {details?.valid?.issues?.map(({ message }) => <p>{message}</p>)}
    </summary>

    <pre>{JSON.stringify(details, null, "  ")}</pre>
  </details>
);
const Success = ({ message, details }) => (
  <details>
    <summary>{message}</summary>

    <pre>{JSON.stringify(details, null, "  ")}</pre>
  </details>
);

const INTL_NAME_SEP = "|";

const homeIntl = (lang: string) =>
  object({
    sticky: coerce(
      nullable(string([
        toTrimmed(),
        startsWith(`https://akvaplan.no/${lang}/`),
      ])),
      (input) => (typeof input === "string" && input.trim()) || null,
    ),
  });

const homeSchema = object({
  no: homeIntl("no"),
  en: homeIntl("en"),
});
type HomeData = Output<typeof homeSchema>;

const schemas = new Map([
  ["home", homeSchema],
]);

const extractFields = (
  schema: { entries: any[] },
  types: string[],
) => Object.entries(schema.entries).filter(([k, v]) => types.includes(v.type));

const parseForm = async (req) => {
  const input = {
    en: {},
    no: {},
    upper,
  };
  const form = await req.formData();

  for (const [name, value] of form) {
    if (name.includes(INTL_NAME_SEP)) {
      const [lang, field] = name.split(INTL_NAME_SEP);
      //@ts-ignore ""
      input[lang][field] = value;
    }
  }
  return input;
};

const kv = await openKv();
export const config: RouteConfig = {
  routeOverride: "/edit/page/:page",
};

export const handler: Handlers = {
  async POST(req, ctx) {
    const { page } = ctx.params;

    const value = await parseForm(req);
    const key = ["page", page];

    const schema = schemas.get(page);
    //@ts-ignore ""
    const valid = await safeParse(schema, value);
    const { success } = valid;
    let response;

    if (success === true) {
      response = await kv.set(key, value);
    }
    return ctx.render({ value, valid, response });
  },
};

const renderPageEdit = async (req, ctx) => {
  const { page } = ctx.params;
  const key = ["page", page];
  const { value, response, valid } = ctx?.data ?? {};

  const schema = schemas.get(page);

  const v = valid && valid.output ? valid.output : (await kv.get(key))?.value;
  const getIntlValue = (lang, name) => v?.[lang]?.[name];

  return (
    <Page>
      <h1>{page}</h1>
      <form method="post">
        {extractFields(schema, ["object"])?.map((
          [objectname, objectschema],
        ) => (
          <div>
            <fieldset
              style={{
                background: "var(--surface0)",
                border: "0px dotted gray",
              }}
            >
              <legend>{objectname}</legend>
              {extractFields(objectschema, [
                "nullable",
                "optional",
                "string",
              ])
                .map((
                  [stringname],
                ) => (
                  <div>
                    <KvTextInput
                      type="url"
                      label={stringname}
                      name={[
                        objectname,
                        stringname,
                      ].join(INTL_NAME_SEP)}
                      value={getIntlValue(objectname, stringname)}
                    />
                  </div>
                ))}
            </fieldset>
          </div>
        ))}

        <Button type="submit">Save</Button>
      </form>

      {valid && (
        <output>
          {valid.success === true
            ? (
              <Success
                message={`Saved`}
                details={{ key, value, response }}
              />
            )
            : (
              <Error
                message="Failed saving"
                details={{ valid, response, key, value }}
              />
            )}
        </output>
      )}
    </Page>
  );
};

export default defineRoute((req, ctx) => {
  const { page } = ctx.params;
  switch (page) {
    case "home":
      return renderPageEdit(req, ctx);
    default:
      return ctx.renderNotFound();
  }
});
