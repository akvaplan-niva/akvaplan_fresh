import {
  extractLangFromUrl,
  lang as langSignal,
  t,
} from "akvaplan_fresh/text/mod.ts";
import { userSignal } from "akvaplan_fresh/user.ts";
import { akvaplanistUrl } from "akvaplan_fresh/services/nav.ts";

import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";

import { computed } from "@preact/signals";

import { IS_BROWSER } from "$fresh/runtime.ts";
import IconButton from "akvaplan_fresh/components/button/icon_button.tsx";

if (IS_BROWSER) {
  const _state = document.querySelector("script#state")?.textContent;
  const state = _state ? JSON.parse(_state) : null;
  if (state) {
    const { user } = state;
    userSignal.value = user;
  }
}

const lang = computed(() =>
  (!IS_BROWSER) ? langSignal.value : extractLangFromUrl(document.URL)
);

const href = computed(() => akvaplanistUrl(userSignal.value, lang.value));
const name = computed(() => userSignal.value?.name);

const wrapperStyle = {
  display: "inline grid",
  gap: ".5rem",
  gridTemplateColumns: "1fr",
  alignItems: "center",
  justifyItems: "center",
  width: "fit-content",
  padding: ".2rem .4rem",
  //backgroundColor: "var(--surface0)",
  borderRadius: ".2rem",
  margin: "0.1rem",
};

export const UserNameOrSignInIcon = () => {
  return IS_BROWSER
    ? (
      <span style={wrapperStyle}>
        {name.value?.length > 0
          ? (
            <a href={href}>
              {name}
            </a>
          )
          : (
            <a href="/auth/sign-in">
              <IconButton
                icon="edit"
                aria-label={t("auth.Sign-in")}
                title={t("auth.Sign-in")}
                style={{ margin: "0.5rem", padding: "0.5rem" }}
              />
            </a>
          )}
      </span>
    )
    : null;
};
