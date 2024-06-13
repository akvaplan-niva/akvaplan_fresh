export const Heavy1 = ({ text, backdrop, ...props }) => (
  <h1
    style="color-scheme: dark;
  color: var(--text1);
  font-size: var(--font-size-fluid-2);
  font-weight: 900;"
    {...props}
  >
    {backdrop ? <span class="backdrop-blur">{text}</span> : text}
  </h1>
);
