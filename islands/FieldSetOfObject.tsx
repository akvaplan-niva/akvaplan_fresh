import KvTextInput from "akvaplan_fresh/islands/KvTextInput.tsx";

export const FieldSetOfObject = (
  { fields, legend, object, path, disabled }: {
    fields: string[];
    legend: string;
    object: any;
    path: string;
    disabled?: boolean;
  },
) => (
  <fieldset style={{ border: 0 }}>
    <legend>{legend}</legend>
    {fields.map((name, i) => (
      <KvTextInput
        label={name}
        name={name}
        value={object?.[name]}
        data-path={`${path}/${name}`}
        disabled={disabled ? true : false}
      />
    ))}
  </fieldset>
);
