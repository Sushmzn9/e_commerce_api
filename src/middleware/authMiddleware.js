import { verifyAccessJWT } from "../helper/jwt.js";
import { getAdminByEmail } from "../model/admin/AdminModel.js";

export const auth = async (req, res, next) => {
  try {
    //get the jwt access key
    const { authorization } = req.header;
    console.log(authorization);
    //decoding the jwt token key
    const decoded = verifyAccessJWT(authorization);
    //extract the email and get user by Email
    if (decoded?.email) {
      //check of user is active

      const user = await getAdminByEmail(decoded.email);
      console.log(user);
      if (user?._id && user?.status === "active") {
        (user.refreshJWT = undefined),
          (user.password = undefined),
          (req.userInfo = user);

        return next();
      }
    }
    res.status(401).json({
      status: "error",
      message: "unauthorized",
    });
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      error.StatusCode = 403;
      error.message = error.message;
    }
    if (error.message.includes("invalid signature")) {
      error.StatusCode = 401;
      error.message = error.message;
    }

    next(error);
  }
};
