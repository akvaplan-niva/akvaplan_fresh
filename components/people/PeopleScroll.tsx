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

export const GroupedPeople = (
  { grouped, group },
) => (
  <div>
    {[...grouped].filter(([grpkey]) => undefined !== grpkey).map((
      [grpkey, grpmembers],
    ) => (
      <div>
        <h2>
          <a
            href={`${group}/${grpkey.toLowerCase()}`}
            title={`${grpkey}: ${grpmembers.length}`}
          >
            {group === "unit" ? t(`unit.${grpkey}`) : grpkey}
          </a>
        </h2>

        <HScroll>
          {grpmembers.map((person) => (
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
