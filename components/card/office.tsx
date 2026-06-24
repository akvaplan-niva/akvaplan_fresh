import { Card } from "@/components/mod.ts";

export const OfficeCard = ({ office }) => (
  <Card>
    <h1>Akvaplan-niva</h1>
    <h2>{office.name}</h2>
    <p>{office.addr?.visit}</p>
    <p>{office.tel}</p>
    {office.tel2 && <p>{office.tel2}</p>}
    <a href={office.links?.map}>{office.links?.map}</a>
  </Card>
);
