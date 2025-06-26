import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(config.database.url, config.database.options)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
