import PaymentSchema from "./PaymentSchema.js";

export const insertPayment = (obj) => {
  return PaymentSchema(obj).save();
};
export const getPayment = () => {
  return PaymentSchema.find();
};
export const updatePaymentById = ({ _id, ...rest }) => {
  return PaymentSchema.findByIdAndUpdate(_id, rest);
};

export const deletePaymentById = (_id) => {
  return PaymentSchema.findByIdAndDelete(_id);
};
