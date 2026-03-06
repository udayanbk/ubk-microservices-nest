import { v4 as uuid } from "uuid"
import { EventEnvelope } from "./event-envelope"

export function createEvent<T>(
  eventType: string,
  payload: T,
  version = "v1"
): EventEnvelope<T> {

  return {
    eventId: uuid(),
    eventType,
    version,
    timestamp: new Date().toISOString(),
    payload
  }
}