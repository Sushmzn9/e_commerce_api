import express from "express";
import { insertCategory } from "../../model/Category/CategoryModel";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    const obj = {
      title,
      slug,
    };
    const result = await insertCategory(obj);
    res.json({
      status: "success",
      message: "TODO category has been added ",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
