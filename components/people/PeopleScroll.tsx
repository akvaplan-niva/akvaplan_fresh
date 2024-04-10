import { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import HScroll from "../hscroll/HScroll.tsx";
import { PeopleCard } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
type Props = {
  people: Akvaplanist[];
};

export function PeopleScroll({ people }: Props) {
  return (
    <HScroll>
      {people.map((person) => <PeopleCard person={person} key={person.id} />)}
    </HScroll>
  );
}

const inline = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
  gridGap: "1rem",
};
export const OnePersonGroup = (
  { members },
) => (
  <ul style={inline}>
    {members.map((person: Akvaplanist) => (
      <li style={inline}>
        <span>
          <PeopleCard person={person} id={person.id} key={person.id} />
        </span>
      </li>
    ))}
  </ul>
);

interface Name extends Pick<Akvaplanist, "family" | "given"> {}

const groupLabel = (
  { group, key, members }: {
    group: string;
    key: string;
    members: Akvaplanist[];
  },
) => {
  const $ = (n: number, k: keyof Name) => members.at(n)?.[k].substring(0, 2);
  const l = (k: keyof Name) =>
    $(0, k) !== $(-1, k) ? `${$(0, k)} ↦ ${$(-1, k)}` : `${$(0, k)}`;
  switch (group) {
    case "section":
      return t(`section.${key}`);
    case "given0":
      return l("given");
    case "family0":
      return l("family");
    default:
      return key;
  }
};

export const GroupedPeople = (
  { grouped, group }: {
    grouped: Map<string, Akvaplanist>;
    group: string;
  },
) => (
  <div>
    {[...grouped].filter(([grpkey]) => undefined !== grpkey).map((
      [key, members],
    ) => (
      <div>
        <span style={{ fontSize: "var(--font-size-0)", color: "var(--text2)" }}>
          {!["family0", "given0"].includes(group)
            ? (
              <a
                href={`${group}/${key.toLowerCase()}`}
                title={`${key}: ${members.length}`}
              >
                {groupLabel({ group, key, members })}
              </a>
            )
            : <span>{groupLabel({ group, key, members })}</span>}
        </span>
        <HScroll>
          {members.map((person) => (
            <PeopleCard
              id={person.id}
              person={person}
              key={person.id}
              icons={false}
            />
          ))}
        </HScroll>
      </div>
    ))}
  </div>
);
