export function encodeAudioBufferToWav(float32PcmBuffer: Float32Array): Blob {
  const wavHeader = getWavHeader({
    numChannels: 1,
    sampleRate: 44100,
    numFrames: float32PcmBuffer.length,
  });
  const blob = new Blob([wavHeader, float32PcmBuffer], { type: "audio/wav" });
  return blob;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options: {
  numFrames: number;
  numChannels: number;
  sampleRate: number;
}) {
  const numFrames = options.numFrames;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 44100;
  const bytesPerSample = 4;
  const format = 3;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dataView = new DataView(buffer);

  let p = 0;

  function writeString(string: string) {
    for (let i = 0; i < string.length; i++) {
      dataView.setUint8(p + i, string.charCodeAt(i));
    }
    p += string.length;
  }

  function writeUint32(data: number) {
    dataView.setUint32(p, data, true);
    p += 4;
  }

  function writeUint16(data: number) {
    dataView.setUint16(p, data, true);
    p += 2;
  }

  writeString("RIFF"); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString("data"); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}
