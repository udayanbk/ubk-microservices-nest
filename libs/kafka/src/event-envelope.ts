export interface EventEnvelope<T> {
  eventId: string
  eventType: string
  version: string
  timestamp: string
  retryCount?: number
  payload: T
}