import { TextLineStream, toTransformStream } from "jsr:@std/streams@1.0.9";
export const ndjsonStream = <In>(
  stream: ReadableStream,
) =>
  stream.pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
    .pipeThrough<In>(
      toTransformStream(async function* (src: AsyncIterable<string>) {
        for await (const chunk of src) {
          if (chunk.trim().length > 0) {
            const parsed: In = JSON.parse(chunk);
            yield parsed;
          }
        }
      }),
    );

export async function* fetchAndStreamJson<In>(url: URL | string) {
  const r = await fetch(url);
  if (r.ok) {
    for await (const entry of await r.json() as { value: In }[]) {
      yield entry?.value;
    }
  }
}
export const fetchAndStreamNdjson = async <In>(url: URL) =>
  ndjsonStream<In>((await fetch(url))?.body!);
