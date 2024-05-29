import { debounce } from "@std/async/debounce";
import KvTextInput, { isText } from "../islands/KvTextInput.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

export const KvListNav = (
  { entries }: { entries: Deno.KvListIterator<unknown> },
) => {
  const handleInput = debounce(async ({ target }) => {
    console.log(target.value);
  }, 1000);

  const save = async (entry, kv) => {
    const { key, value } = entry;
    const res = await kv.set(key, value);
  };

  return (
    <nav>
      <p style={{ fontSize: "0.75rem" }}>{entries.length}</p>

      <ol
        style={{ paddingBlockStart: "0rem", paddingBlockEnd: "1.5rem" }}
      >
        {entries?.map(({ key, value }) => (
          <li
            style={{
              fontSize: "1rem",
              margin: "1px",
              padding: "0.5rem",
              background: "var(--surface2)",
            }}
          >
            <details>
              <summary>
                <span style={{ color: "var(--link)" }}>
                  {value?.text ?? JSON.stringify(key)}
                </span>
              </summary>
              <div style={{ fontSize: "0.75rem" }}>
                {Object.entries(value).map(([k, v]) =>
                  isText(v)
                    ? <KvTextInput name={k} value={v} onInput={handleInput} />
                    : null
                )}
                {Object.entries(value).map(([k, v]) =>
                  Array.isArray(v)
                    ? v.map((x) => (
                      <KvTextInput name={k} value={x} onInput={handleInput} />
                    ))
                    : null
                )}
                <pre>{JSON.stringify(value, null, "  ")}</pre>
                <form>
                  <Pill onClick={() => save({ key, value })}>
                    Save
                  </Pill>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </nav>
  );
};
