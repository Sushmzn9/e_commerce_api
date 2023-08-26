import { auth } from "../../middleware/authMiddleware.js";
import { getAdminDisplay } from "../../model/admin/AdminModel.js";
import express from "express";

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const user = await getAdminDisplay();
    console.log(user);

    res.json({
      status: "success",
      message: "here is the list ",
      user,
    });
    console.log(user);
  } catch (error) {
    next(error);
  }
});

export default router;
