import Joi from "joi";

const SHORTSTRREQ = Joi.string().min(3).max(100).required();
const SHORTSTR = Joi.string().min(3).max(100);
const LONGSTR = Joi.string().min(3).max(10000);
const NUM = Joi.number();
const NUMREQ = Joi.number().required();

export const newAdminValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      fName: SHORTSTRREQ,
      lName: SHORTSTRREQ,
      email: SHORTSTR.email({ minDomainSegments: 2 }).required(),
      phone: SHORTSTRREQ,
      address: SHORTSTR.allow(""),
      password: SHORTSTRREQ.min(6),
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const loginValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      email: SHORTSTRREQ.email({ minDomainSegments: 2 }),
      password: SHORTSTRREQ.min(6),
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const newAdminVerificationValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      e: SHORTSTRREQ.email({ minDomainSegments: 2 }),
      c: SHORTSTRREQ,
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
// ======== category
export const updateCatValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      _id: SHORTSTRREQ,
      title: SHORTSTRREQ,
      status: SHORTSTRREQ,
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// ======== payment options
export const newPOValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      status: SHORTSTRREQ,
      title: SHORTSTRREQ,
      description: SHORTSTRREQ,
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const updatePOValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      _id: SHORTSTRREQ,
      status: SHORTSTRREQ,
      title: SHORTSTRREQ,
      description: SHORTSTRREQ,
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

///product Validation

export const newProductValidation = (req, res, next) => {
  try {
    //define the schema
    req.body.salesPrice = req.body.salesPrice || 0;
    const schema = Joi.object({
      name: SHORTSTRREQ,
      status: SHORTSTRREQ,
      sku: SHORTSTRREQ,
      parentCat: SHORTSTRREQ,
      description: LONGSTR,
      salesPrice: NUM,
      qty: NUMREQ,
      price: NUMREQ,
      salesEndDate: SHORTSTR.allow("", null),
      salesStartDate: SHORTSTR.allow("", null),
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const updateProductValidation = (req, res, next) => {
  try {
    //define the schema
    req.body.salesPrice = req.body.salesPrice || 0;
    req.body.salesStartDate =
      req.body.salesStartDate === "null" || !req.body.salesStartDate
        ? null
        : req.body.salesStartDate;

    req.body.salesStartDate =
      req.body.salesEndDate === "null" || !req.body.salesEndDate
        ? null
        : req.body.salesEndDate;

    const schema = Joi.object({
      _id: SHORTSTRREQ,
      name: SHORTSTRREQ,
      status: SHORTSTRREQ,
      parentCat: SHORTSTRREQ,
      description: LONGSTR,
      salesPrice: NUM,
      qty: NUMREQ,
      price: NUMREQ,
      salesEndDate: SHORTSTR.allow("", null),
      salesStartDate: SHORTSTR.allow("", null),
      images: LONGSTR.allow(""),
      thumbnail: LONGSTR.allow(""),
    });

    const { error } = schema.validate(req.body);
    req.body.images = req.body.images.split(",");

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
