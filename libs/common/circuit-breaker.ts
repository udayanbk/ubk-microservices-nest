import CircuitBreaker from "opossum";

export function createCircuitBreaker(fn: any, name: string) {

  const breaker = new CircuitBreaker(fn, {

    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000

  });

  breaker.on("open", () => {
    console.log(`🔴 Circuit OPEN for ${name}`);
  });

  breaker.on("halfOpen", () => {
    console.log(`🟡 Circuit HALF OPEN for ${name}`);
  });

  breaker.on("close", () => {
    console.log(`🟢 Circuit CLOSED for ${name}`);
  });

  breaker.on("reject", () => {
    console.log(`⚠ Request rejected by circuit ${name}`);
  });

  return breaker;
}