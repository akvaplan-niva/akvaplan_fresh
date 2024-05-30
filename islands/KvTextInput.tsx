import { Input } from "akvaplan_fresh/components/input.tsx";
export const isText = (v) => v && typeof v === "string";

export default function KvTextInput(props) {
  return (
    <div style="padding: 0.25rem 0.5rem 0.25rem 2.5rem;">
      <label>
        {props.label ?? props.name}
        <Input
          type={props.type ?? "text"}
          {...props}
        />
      </label>
      {/* <p>{" ⇐ "}{props.value}</p> */}
    </div>
  );
}
