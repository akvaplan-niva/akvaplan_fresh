import { ulid } from "@std/ulid";
export const genid = () => ulid().toLowerCase();
export const ID_ABOUT = "01hzfwfctv0h33c494bje9y7r0";
export const ID_ACCREDITATION = "01j0b947qxcrgvehnpzskttfd2";
export const ID_CERTIFICATION = "01j17m18wawc1jcw1zh3g47d6h";
export const ID_DOCUMENTATION = "01j2c34exdfgyc0j1f4asnzbpn";
export const ID_HOME_HERO = "01hyd6qeqv77bp980k1mw33rt0";
export const ID_INFRASTRUCTURE = "01hyd6qeqvrzwkbkf4frh6ewhk";
export const ID_INVOICING = "01j0k42cn0qmmh0knsj3v2wpn2";
export const ID_MANAGEMENT = "01j0n61jx4kx3xqwxz01yved5b";
export const ID_OFFICES = "01j1a0ch6560nkkc7nb97adsb6";
export const ID_PEOPLE = "01hyd6qeqtfewhjjxtmyvgv35q";
export const ID_RESEARCH = "01hyd6qeqvy0ghjnk1nwdfwvyq";
export const ID_PROJECTS = "01hyd6qeqv71dyhcd3356q31sy";
export const ID_PUBLICATIONS = "01j14p49bxc5ek3n2dgb3133j0";
export const ID_SERVICES = "01hyd6qeqv4n3qrcv735aph6yy";

export const slugIds = new Map([
  ["fakturering", ID_INVOICING],
  ["invoicing", ID_INVOICING],
]);
