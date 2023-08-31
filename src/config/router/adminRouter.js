import express from "express";
import { comparePassword, hashPassword } from "../../helper/bcrypt.js";
import {
  getAdminByEmail,
  getAdminById,
  getOneAdmin,
  insertAdmin,
  updateAdmin,
  updateAdminById,
} from "../../model/admin/AdminModel.js";
import {
  loginValidation,
  newAdminValidation,
  newAdminVerificationValidation,
} from "../../middleware/joiValidation.js";
import {
  accountVerificationEmail,
  accountVerifiedNotification,
  sendOTPNotification,
} from "../../helper/nodemailer.js";
import { v4 as uuidv4 } from "uuid";
import { createAcessJWT, createRefreshJWT } from "../../helper/jwt.js";
import { auth, refreshAuth } from "../../middleware/authMiddleware.js";
import {
  deleteSession,
  insertNewSession,
} from "../../model/Session/SessionModel.js";
import { otpGenerator } from "../../helper/otpGenerator.js";
const router = express.Router();

//get admin details

router.get("/", auth, (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "here is the user info",
      user: req.userInfo,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//update userInfo
router.put("/", auth, async (req, res, next) => {
  try {
    const { _id, password, ...rest } = req.body;
    const user = await getAdminById(_id);
    console.log(user);
    //check the password
    const isMatched = comparePassword(password, user.password);
    console.log(isMatched);
    console.log(password, user.password);
    if (isMatched) {
      const result = await updateAdminById(_id, rest);
      result?._id
        ? res.json({
            status: "success",
            message: "The Admin has been updated",
          })
        : res.json({
            status: "error",
            message: "Error, Unable to update Admin.",
          });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/change-password", auth, async (req, res, next) => {
  console.log(req.body);
  try {
    const { _id } = req.userInfo;
    const { password, newPassword } = req.body;
    const user = await getAdminById({ _id });
    if (user?._id) {
      const isMatched = comparePassword(password, user.password);
      console.log(isMatched);
      if (isMatched) {
        const pp = hashPassword(newPassword);

        const result = await updateAdmin({ _id }, { password: pp });
        console.log(result);

        if (result?._id) {
          res.json({
            status: "success",
            message: "Password is succesfully changed",
          });

          res.json({
            status: "error",
            message: "error to update",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
});
// create new admin

router.post("/", auth, newAdminValidation, async (req, res, next) => {
  try {
    // console.log(req.body);

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
    res.json({
      status: "error",
      message: "Unable to add new admin, Please try agian later",
    });
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

router.post("/sign-in", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //find the user by email

    const user = await getAdminByEmail({ email });
    if (user?._id) {
      //check the password
      const isMatched = comparePassword(password, user.password);

      if (isMatched) {
        //create 2 jwts:

        const accessJWT = await createAcessJWT(email);
        const refreshJWT = await createRefreshJWT(email);
        console.log(accessJWT);
        // create accessJWT and store in session table: short live 15m
        ///create refreshJWT and store with user data in user table: long live 30d

        return res.json({
          status: "success",
          message: "logined successfully",
          token: { accessJWT, refreshJWT },
        });
      }
    }

    // return the jwts
    res.json({
      status: "error",
      message: "Invalid login details",
    });
  } catch (error) {
    next(error);
  }

  // return the refreshJWT
  router.get("/get-accessjwt", refreshAuth);

  //logout
  router.post("/logout", async (req, res, next) => {
    try {
      const { accessJWT, refreshJWT, _id } = req.body;

      accessJWT && deleteSession(accessJWT);

      if (refreshJWT && _id) {
        const dt = await updateAdminById({ _id, refreshJWT: "" });
      }

      res.json({
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  });
});

//---reset the password
router.post("/request-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (email) {
      const user = await getAdminByEmail({ email });
      console.log(user);
      if (user?._id) {
        const otp = otpGenerator();
        console.log(otp);
        const obj = {
          token: otp,
          associate: email,
        };
        const result = await insertNewSession(obj);
        if (result?._id) {
          await sendOTPNotification({
            otp,
            email,
            fName: user.fName,
          });
        }
      }
    }
    res.json({
      status: "success",
      message:
        "If your email exit you will receive email into your mailbox,please check your email for the instruction and otp",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
