import express from "express";

import {
  deletePaymentById,
  getPayment,
  insertPayment,
  updatePaymentById,
} from "../../model/Payment/PaymentModel.js";
import {
  newPOValidation,
  updatePOValidation,
} from "../../middleware/joiValidation.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await getPayment();
    res.json({
      status: "success",
      message: "New Payment has been added ",
      result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", newPOValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await insertPayment(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "New Payment has been added ",
        })
      : res.json({
          status: "error",
          message: "Error, unable to add ",
        });
  } catch (error) {
    next(error);
  }
});

router.put("/", updatePOValidation, async (req, res, next) => {
  try {
    const result = await updatePaymentById(req.body);

    result?._id
      ? res.json({
          status: "success",
          message: "The payment has been updated",
        })
      : res.json({
          status: "error",
          message: "Error, Unable to udpate new payment.",
        });
  } catch (error) {
    next(error);
  }
});
router.delete("/:_id", async (req, res, next) => {
  const { _id } = req.params;
  try {
    if (_id) {
      const result = await deletePaymentById(_id);
      result?._id &&
        res.json({
          status: "success",
          message: "The payment has been deleted",
        });

      return;
    }

    res.json({
      status: "error",
      message: "Error, Unable to process your request.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
