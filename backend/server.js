require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());
const professorRoutes = require("./routes/professorRoutes");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Professor Insight Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/reviews", reviewRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});