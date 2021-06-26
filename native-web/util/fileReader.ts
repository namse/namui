export function readAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      resolve(fileReader.result as ArrayBuffer);
    };

    fileReader.onerror = (event) => reject(event);
    console.log(blob);
    fileReader.readAsArrayBuffer(blob);
  });
}
