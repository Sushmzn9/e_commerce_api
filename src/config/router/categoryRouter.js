import express from "express";
import {
  deleteCategoryById,
  getCategory,
  insertCategory,
  updateCategoryById,
} from "../../model/Category/CategoryModel.js";
import slugify from "slugify";
import { updateCatValidation } from "../../middleware/joiValidation.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await getCategory();
    res.json({
      status: "success",
      message: "New category has been added ",
      result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    !title &&
      res.json({
        status: "error",
        message: "category title is required",
      });

    const obj = {
      title,
      slug: slugify(title, { trim: true, lower: true }),
    };
    const result = await insertCategory(obj);
    result?._id
      ? res.json({
          status: "success",
          message: "New category has been added ",
        })
      : res.json({
          status: "Error",
          message: "Error, unable to add ",
        });
  } catch (error) {
    next(error);
  }
});

router.put("/", updateCatValidation, async (req, res, next) => {
  try {
    const result = await updateCategoryById(req.body);

    result?._id
      ? res.json({
          status: "success",
          message: "The category has been updated",
        })
      : res.json({
          status: "error",
          message: "Error, Unable to udpate new category.",
        });
  } catch (error) {
    next(error);
  }
});
router.delete("/:_id", async (req, res, next) => {
  const { _id } = req.params;
  try {
    if (_id) {
      const result = await deleteCategoryById(_id);
      result?._id &&
        res.json({
          status: "success",
          message: "The category has been deleted",
        });

      return;
    }

    res.json({
      status: "error",
      message: "Error, Unable to process your request.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
