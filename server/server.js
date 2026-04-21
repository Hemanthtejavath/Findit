import express from "express";
const app = express();
import connectDb from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cleanupCompletedItems from "./services/cleanupCompletedItems.js";

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("backend server Runnig succesfully");
});

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);

//error handling in  while uploding file bigger in size or not a image
app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "File size should be less than 5MB" });
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: error.message || "Server error" });
});

const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDb().then(() => {
  cleanupCompletedItems();

  setInterval(
    () => {
      cleanupCompletedItems();
    },
    24 * 60 * 60 * 1000,
  );

  // Start the server after successful database connection
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
