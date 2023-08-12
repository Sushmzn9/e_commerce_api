import express from "express";

import slugify from "slugify";
import { getproduct, insertproduct } from "../../model/Product/ProductModel.js";
import { newProductValidation } from "../../middleware/joiValidation.js";
const router = express.Router();

//setup multer
// const upload = multer();
// where do you want to store the file
// what name do you want to give to

router.get("/", async (req, res, next) => {
  try {
    const products = await getproduct();
    res.json({
      status: "success",
      message: "Here are the products",
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", newProductValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.name, { trim: true, lower: true });
    const result = await insertproduct(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "product has been added ",
        })
      : res.json({
          status: "error",
          message: "product is unable to be  added ",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "The product slug or sku already related to another product, change name and sku and try again later";
    }
    next(error);
  }
});
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const result = await deleteproductbyId(_id);

    result?._id
      ? res.json({
          status: "success",
          message: "The  product has been deleted successfully",
        })
      : res.json({
          status: "error",
          message: "Unable to delete the product, try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
