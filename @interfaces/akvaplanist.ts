export interface Akvaplanist {
  given: string;
  family: string;
  //position: Position;
  tel?: string;
  unit?: string;
  workplace?: string;
  country?: string;
  id: string;
  email: string;
  employed?: boolean;
  created?: Date | string;
  updated?: Date | string;
}
export interface Position {
  [lang: string]: string;
}
