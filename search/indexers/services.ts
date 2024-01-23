import { AnyOrama, Orama } from "@orama/orama";

export const insertCustomerServices = async (
  { db, lang }: { db: AnyOrama; lang: string },
) => {
  // for await (
  //   const { key: [, id], value } of kv.list({
  //     prefix: ["akvaplanists"],
  //   })
  // ) {
  //   // const atom: Atom = {
  //   //   ...value,
  //   //   title: name,
  //   //   canonical: `/no/folk/id/${value.id}`,
  //   //   collection: "person",
  //   //   lang: "no",
  //   // };
  //   await insert(db, atom);
  // }
};
