export function extractId(str: string) {
  const regex = /[\/-](?<id>\w+)$/;
  const match = regex.exec(str);
  if (match && match?.groups?.id) {
    return match.groups.id;
  }
}
