import { t } from "akvaplan_fresh/text/mod.ts";
import { Pill } from "../button/pill.tsx";
import { InputSearch } from "../search/InputSearch.tsx";

export const PeopleSearchForm = ({ q, sortdir, group }) => (
  <>
    <form autocomplete="off">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          marginBlockStart: "1rem",
          paddingBlockEnd: "2rem",
        }}
      >
        <InputSearch
          autofocus
          type="search"
          name="q"
          value={q}
          placeholder={t("people.search.placeholder")}
        />
      </div>
    </form>
    <menu
      style={{
        display: "grid",
        justifyContent: "end",
        fontSize: "1rem",
      }}
    >
      <p>
        <label>{t("people.group_by")}</label>
        <a href="given0">
          <Pill aria-pressed={group === "given0"}>{t("people.gn")}</Pill>
        </a>
        <a href="family0">
          <Pill aria-pressed={group === "family0"}>{t("people.fn")}</Pill>
        </a>
        <a href="section">
          <Pill aria-pressed={group === "section"}>{t("people.section")}</Pill>
        </a>
        <a href="workplace">
          <Pill aria-pressed={group === "workplace"}>
            {t("people.workplace")}
          </Pill>
        </a>
      </p>

      {
        /* <p>
        <div name="sort" id="sort-select">
          <label for="sort-select">{t("sort.label")}:</label>{" "}
          <a href="">
            <Pill>{t("sort.increasing")}</Pill>
          </a>

          <a href={`?sortdir=-1`}>
            <Pill>{t("sort.decreasing")}</Pill>
          </a>
        </div>
      </p> */
      }
    </menu>

    {/* <p>{t("people.subtitle")}</p> */}
  </>
);
