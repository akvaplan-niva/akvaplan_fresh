import KvTextInput, { TextArea } from "akvaplan_fresh/islands/KvTextInput.tsx";

export const FieldSetOfObject = (
  { fields, legend, object, path, disabled, areas }: {
    fields: string[];
    legend: string;
    object: any;
    path: string;
    disabled?: boolean;
    areas: string[];
  },
) => {
  console.warn(areas);
  return (
    <fieldset style={{ border: 0 }}>
      <legend>{legend}</legend>

      {fields.map((name, i) => (
        "desc" === name
          ? (
            new Error(name) && (
              <TextArea
                label={name}
                name={name}
                value={object?.[name]}
                data-path={`${path}/${name}`}
                disabled={disabled ? true : false}
              />
            )
          )
          : (
            <KvTextInput
              label={name}
              name={name}
              value={object?.[name]}
              data-path={`${path}/${name}`}
              disabled={disabled ? true : false}
            />
          )
      ))}
    </fieldset>
  );
};
