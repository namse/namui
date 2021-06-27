export async function s3FetchGet<T>(bucket: string, key: string): Promise<T> {
  const url = `https://${bucket}.s3.ap-northeast-2.amazonaws.com/${key}`;
  const response = await fetch(encodeURI(url));
  return response.json();
}
