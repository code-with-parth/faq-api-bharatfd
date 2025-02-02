module.exports = {
    mongoURI: process.env.MONGO_URI || "mongodb://localhost/faq_db",
    redisURL: process.env.REDIS_URL || "redis://localhost:6379",
    jwtSecret: process.env.JWT_SECRET || "hwqihrhwe",
  }
  
  