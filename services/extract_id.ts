export function extractId(str: string) {
  if (URL.canParse(str)) {
    const { pathname } = new URL(str);
    str = pathname;
  }
  str = str.split("/")?.at(-1)!;
  if (!/-/.test(str)) {
    return str;
  }
  const regex = /[\/-](?<id>\w+)$/;
  const match = regex.exec(str);
  if (match && match?.groups?.id) {
    return match.groups.id;
  }
}
