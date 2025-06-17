import { Redis } from "@upstash/redis";
import "dotenv/config";
import { Ratelimit } from "@upstash/ratelimit";

const ratelimite = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

export default ratelimite;
