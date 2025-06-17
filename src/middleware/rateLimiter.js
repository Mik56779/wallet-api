import ratelimite from "../config/upstash.js";

const GetrateLimiter = async (req, res, next) => {
  try {
    //here its kept simple with a single rate limit key "my-rate-limit"
    // You can customize this to use different keys based on user ID or IP address
    // For example, you can use req.ip or req.user.id to create a unique key for each user
    // This allows you to limit requests per user rather than globally
    const { success } = await ratelimite.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({ message: "Gone to sleep try again Later" });
    }

    next();
  } catch (error) {
    console.log("Error Rate Limiting", error);
    next(error);
  }
};

export default GetrateLimiter;
// This middleware checks the rate limit for incoming requests.
// If the limit is exceeded, it responds with a 429 status code.
// If the request is within the limit, it calls the next middleware or route handler.
// It uses the ratelimite instance to check the limit and handle the response accordingly.
// The error handling ensures that any issues with the rate limiting service are logged and passed to the next middleware.
// This is useful for preventing abuse of the API and ensuring fair usage among users.
// It can be applied to specific routes or globally in the Express app.
// This code is a middleware function for rate limiting in an Express.js application.
// It uses the Upstash Ratelimit service to limit the number of requests a user can make within a specified time frame.
// The middleware checks if the request exceeds the defined rate limit and responds accordingly.
// The `ratelimite` instance is imported from the `ratelimiter.js` file, which is configured to use Upstash's Redis service.
// The middleware is designed to be used in an Express.js application to protect routes from excessive requests.
