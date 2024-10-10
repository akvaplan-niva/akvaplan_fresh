export const nvaApiBase = "https://api.test.nva.aws.unit.no";
export const nvaHome = "https://test.nva.sikt.no";

export const nvaPublicationLanding = (id: string, lang?: string) =>
  new URL(`/registration/${id}`, nvaHome);
