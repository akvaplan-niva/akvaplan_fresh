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
