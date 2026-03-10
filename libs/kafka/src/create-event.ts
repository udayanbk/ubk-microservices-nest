import { v4 as uuid } from "uuid"
import { EventEnvelope } from "./event-envelope"

export function createEvent<T>(
  eventType: string,
  payload: T,
  version = "v1",
  retryCount = 0
): EventEnvelope<T> {

  return {
    eventId: uuid(),
    eventType,
    version,
    timestamp: new Date().toISOString(),
    retryCount,
    payload
  }
}