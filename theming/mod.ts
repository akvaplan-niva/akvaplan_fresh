import { signal } from "@preact/signals";
export const defaultTheme = "blue";
export const themes = new Set(["dark", defaultTheme, "light"]);

const getRoot = () => globalThis?.document?.documentElement;
const getStorage = () => globalThis?.localStorage;
const ATTR = "color-scheme";

export const getAttrColorScheme = (el: HTMLElement = getRoot()) => {
  if (el?.getAttribute) {
    return el.getAttribute(ATTR);
  }
};
export const theme = signal(getAttrColorScheme());

export const storeTheme = (name: string, storage = getStorage()) => {
  if (themes.has(name)) {
    if (storage?.getItem && storage?.getItem("theme") !== name) {
      storage.setItem("theme", name);
    }
  }
};

export const unstoreTheme = (storage = getStorage()) =>
  storage?.removeItem("theme");

export const setAttrColorScheme = (
  name: string,
  el = getRoot(),
) => {
  if (themes.has(name)) {
    // Update signal
    theme.value = name;

    // Set attribute
    if (el?.getAttribute && el.getAttribute(ATTR) !== name) {
      el.setAttribute(ATTR, name);
    }
  }
};
// const selector = "[color-scheme]";
// for (const el of document.querySelectorAll(selector)) {
//   el.removeAttribute("color-scheme");
// }
export const removeAttrColorScheme = (el = getRoot()) => {
  if (el?.hasAttribute(ATTR)) {
    el.removeAttribute(ATTR);
  }
};

export const addColorSchemeChangeHandlers = () => {
  matchMedia("(prefers-color-scheme: dark)").addEventListener(
    "change",
    ({ matches }) => matches && setTheme("dark"),
  );
  matchMedia("(prefers-color-scheme: light)").addEventListener(
    "change",
    ({ matches }) => matches && setTheme("light"),
  );
};
export const removeTheming = () => {
  if (theme?.value) {
    theme.value = "";
  }
  removeAttrColorScheme();
  unstoreTheme();
};

export const setTheme = (name: string) => {
  //if (theme?.value) {
  theme.value = name;
  //}
  setAttrColorScheme(name);
  storeTheme(name);
};

export const buildInitTheming = () =>
  `(() => {
    const themes = new Set(${JSON.stringify([...themes])});
    const defaultTheme = "${defaultTheme}";
    const ATTR = "${ATTR}";
    const storeTheme = ${String(storeTheme)};
    const getRoot = ${String(getRoot)};
    const getStorage = ${String(getStorage)};
    const setAttrColorScheme = ${String(setAttrColorScheme)};
    const setTheme = ${String(setTheme)};
    const addColorSchemeChangeHandlers = ${
    String(addColorSchemeChangeHandlers)
  };
    const theme = getStorage().getItem("theme") ?? defaultTheme;
    if (theme !== "${defaultTheme}") {
      setTheme(theme);
    }
    addColorSchemeChangeHandlers();
  })();
`;
