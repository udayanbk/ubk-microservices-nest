export async function retryWithBackoff(
  fn: () => Promise<any>,
  retries = 3,
  delay = 1000
) {

  let attempt = 0;

  while (attempt < retries) {

    try {

      return await fn();

    } catch (error) {

      attempt++;

      console.log(`⚠ Retry attempt ${attempt}`);

      if (attempt >= retries) {
        throw error;
      }

      const backoff = delay * Math.pow(2, attempt);

      console.log(`⏳ Waiting ${backoff}ms before retry`);

      await new Promise(res => setTimeout(res, backoff));

    }
  }

}