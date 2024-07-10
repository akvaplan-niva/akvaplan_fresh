import { encodeBase64 } from "@std/encoding/base64";

export const base64DataUri = (
  bytes: Uint8Array,
  contentType = "application/octet-stream",
) => {
  return `data:${contentType};base64,${encodeBase64(bytes)}`;
};
