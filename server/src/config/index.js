import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/farm-trade",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  database: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/farm-trade",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

export default config;
