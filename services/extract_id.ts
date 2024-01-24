export function extractId(str: string) {
  if (!/-/.test(str)) {
    return str;
  }
  const regex = /[\/-](?<id>\w+)$/;
  const match = regex.exec(str);
  if (match && match?.groups?.id) {
    return match.groups.id;
  }
}
