export async function readAll(
  stream: ReadableStream<Uint8Array>
): Promise<ArrayBuffer> {
  const reader = stream.getReader();

  const chunks: Uint8Array[] = [];
  while (true) {
    const result = await reader.read();
    if (result.done) {
      break;
    }
    chunks.push(result.value);
  }
  const byteLength = chunks.reduce((prev, chunk) => prev + chunk.length, 0);
  const buffer = new Uint8Array(byteLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    buffer.set(chunk, offset);
    offset += chunk.length;
  });
  return buffer.buffer;
}
