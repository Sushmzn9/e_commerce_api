import express from "express";
import { hashPassword } from "../../helper/bcrypt.js";
import { insertAdmin, updateAdmin } from "../../model/admin/AdminModel.js";
import {
  newAdminValidation,
  newAdminVerificationValidation,
} from "../../middleware/joiValidation.js";
import {
  accountVerificationEmail,
  accountVerifiedNotification,
} from "../../helper/nodemailer.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

// create new admin

router.post("/", newAdminValidation, async (req, res, next) => {
  try {
    console.log(req.body);

    // encrypt password
    const { password } = req.body;
    req.body.password = hashPassword(password);

    //  create code and add with ree.body

    req.body.verificationCode = uuidv4();

    // insert into db
    const result = await insertAdmin(req.body);

    //resp user

    if (result?._id) {
      res.json({
        status: "success",
        message:
          "Please check your email and follow instruction to activate your account",
      });

      const link = `${process.env.WEB_DOMAIN}/admin-verification?c=${result.verificationCode}&e=${result.email}`;
      await accountVerificationEmail({
        fName: result.fName,
        email: result.email,
        link,
      });
      return;
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      //   error.statusCode = 401;
      error.message =
        " This email is already used by Another Admin, Use different email or reset your password";
    }
    next(error);
  }
});

//verifiying the new accout
router.post(
  "/admin-verification",
  newAdminVerificationValidation,
  async (req, res, next) => {
    try {
      const { c, e } = req.body;
      const filter = {
        email: e,
        verificationCode: c,
      };
      const updateObj = {
        isVerified: true,
        verificationCode: "",
      };
      const result = await updateAdmin(filter, updateObj);

      if (result?._id) {
        await accountVerifiedNotification(result);
        res.json({
          status: "success",
          message: "Your account has been verified, you may login now!",
        });

        return;
      }
      res.json({
        status: "error",
        message: "Link is expired or invalid!",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
