import express from "express";

const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    const { title } = req.body;
    res.json({
      status: "success",
      message: "TODO category has been added ",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
