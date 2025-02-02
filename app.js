const express = require("express");
const mongoose = require("mongoose");
const { createClient } = require("redis");
const config = require("./config");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "admin/layout");

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Connect to Redis
const redisClient = createClient({ url: config.redisURL });

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

(async () => {
  await redisClient.connect();
})();

// Async Redis get and set methods
const getAsync = async (key) => await redisClient.get(key);
const setAsync = async (key, value) => await redisClient.set(key, value);

// Make Redis client available in req object
app.use((req, res, next) => {
  req.redisClient = { getAsync, setAsync };
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/faqs", require("./routes/faq"));
app.use("/admin", require("./routes/admin"));

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;