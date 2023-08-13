import express from "express";

import slugify from "slugify";
import {
  deleteproductById,
  getProductById,
  getproduct,
  insertproduct,
  updateproductById,
} from "../../model/Product/ProductModel.js";
import {
  newProductValidation,
  updateProductValidation,
} from "../../middleware/joiValidation.js";
const router = express.Router();

//setup multer
// const upload = multer();
// where do you want to store the file
// what name do you want to give to

import multer from "multer";

const imgFolderPath = "public/img/Product";
console.log(imgFolderPath);
//setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("from multer", file);
    let error = null;
    // validation check
    cb(error, imgFolderPath);
  },
  filename: (req, file, cb) => {
    let error = null;
    // construct/ rename file name
    const fullFileName = Date.now() + "-" + file.originalname;

    cb(error, fullFileName);
  },
});

const upload = multer({ storage });

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const products = _id ? await getProductById(_id) : await getproduct();

    res.json({
      status: "success",
      message: "Here are the products",
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      console.log(req.files);

      if (req.files?.length) {
        req.body.images = req.files.map((item) => item.path);
        req.body.thumbnail = req.body.images[0];
      }

      req.body.slug = slugify(req.body.name, { trim: true, lower: true });

      const result = await insertproduct(req.body);

      result?._id
        ? res.json({
            status: "success",
            message: "The new product has been added successfully",
          })
        : res.json({
            status: "error",
            message: "Unable to add new product, try again later",
          });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection")) {
        error.statusCode = 200;
        error.message =
          "The product slug or sku alread related to another product, change name and sku and try agin later.";
      }
      next(error);
    }
  }
);

router.put(
  "/",
  upload.array("images", 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      console.log(req.files);

      if (req.files.length) {
        const newImgs = req.files.map((item) => item.path);
        req.body.images = [...req.body.images[0]];
      }

      const result = await updateproductById(req.body);

      result?._id
        ? res.json({
            status: "success",
            message: "The new product has been edited successfully",
          })
        : res.json({
            status: "error",
            message: "Unable to edit new product, try again later",
          });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const result = await deleteproductById(_id);

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
