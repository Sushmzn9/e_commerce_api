import dotenv from "dotenv";
dotenv.config();
import { mongoConnect } from "./src/config/mongoConfig.js";
mongoConnect();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();
console.log(__dirname);

app.use(express.static(path.join(__dirname + "/public")));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// api

import adminRouter from "./src/config/router/adminRouter.js";
app.use("/api/v1/admin", adminRouter);
import categoryRouter from "./src/config/router/categoryRouter.js";
import { auth } from "./src/middleware/authMiddleware.js";
app.use("/api/v1/category", auth, categoryRouter);
import paymentRouter from "./src/config/router/paymentRouter.js";
app.use("/api/v1/payment", auth, paymentRouter);
import productRouter from "./src/config/router/productRouter.js";
app.use("/api/v1/product", auth, productRouter);
import adminDisplayRouter from "./src/config/router/adminDisplayRouter.js";

app.use("/api/v1/admindisplay", adminDisplayRouter);

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
  console.log(error);
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
