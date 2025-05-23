export interface Akvaplanist {
  id?: string;
  given: string;
  family: string;
  name?: string;
  position?: IntlString;
  tel?: string;
  section?: string;
  workplace?: string;
  country?: string;
  email?: string;
  homepage?: URL | string;
  created?: Date | string;
  updated?: Date | string;
  from?: Date | string;
  expired?: Date | string;
  openalex?: string | null;
  github?: string | null;
  orcid?: string | null;
  prior?: boolean;
}
export interface IntlString {
  [lang: string]: string;
}
