import { Icon } from "./icon.tsx";

type InputSearchProps = {};

export function Input({ ...props }: InputSearchProps) {
  return (
    <div className="search-container">
      <input className="search-input" {...props} />
      {props?.icon
        ? (
          <button type="submit" className="search-icon">
            <Icon name={props?.icon ?? ""} width={20} height={20} />
          </button>
        )
        : null}
    </div>
  );
}

export default function InputWithLabel(props) {
  return (
    <div style="padding: 0.25rem 0.5rem 0.25rem 2.5rem;">
      <label>
        {props.label ?? props.name}
        <Input
          type={props.type ?? "text"}
          {...props}
        />
      </label>
    </div>
  );
}
