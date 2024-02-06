import { Input } from "akvaplan_fresh/components/input.tsx";
import { debounce } from "std/async/debounce.ts";
const isText = (v) => v && typeof v === "string";
export const Nav = ({ entries, kv }) => {
  const handleInput = debounce(async ({ target }) => {
    console.log(target.value);
  }, 1000);
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
                  {value?.text ?? JSON.stringify(key.slice(1))}
                </span>
              </summary>
              <div style={{ fontSize: "0.75rem" }}>
                {Object.entries(value).map(([k, v]) =>
                  isText(v)
                    ? <KvTextInput name={k} value={v} onInput={handleInput} />
                    : null
                )}
                {Object.entries(value).map(([k, v]) =>
                  Array.isArray(v) ? JSON.stringify(v) : null
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default function KvTextInput(props) {
  return (
    <div style="padding: 0.25rem 0.5rem 0.25rem 2.5rem;">
      <label>
        {props.name}
        <Input
          type="text"
          {...props}
        />
      </label>
      <p>{" ⇐ "}{props.value}</p>
    </div>
  );
}
