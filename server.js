import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 8000;

import { mongoConnect } from "./src/config/mongoConfig.js";

mongoConnect();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// api

import adminRouter from "./src/config/router/adminRouter.js";
app.use("/api/v1/admin", adminRouter);
import categoryRouter from "./src/config/router/categoryRouter.js";
import { auth } from "./src/middleware/authMiddleware.js";
app.use("/api/v1/category", auth, categoryRouter);

app.get("/", (req, res) => {
  try {
    res.json({
      status: "success",
      message: "server running well",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

app.use((error, req, res, next) => {
  res.json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${PORT}`);
});
