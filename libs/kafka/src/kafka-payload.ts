export function extractKafkaPayload<T>(data: any): T {
  if (data?.value) {
    return data.value as T;
  }
  return data as T;
}