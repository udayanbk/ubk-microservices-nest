export interface EventEnvelope<T> {
  eventId: string
  eventType: string
  version: string
  timestamp: string
  payload: T
}