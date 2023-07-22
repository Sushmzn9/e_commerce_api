import adminSchema from "./AdminSchema.js";

export const insertAdmin = (obj) => {
  return adminSchema(obj).save();
};
export const getAdminByEmail = (email) => {
  return adminSchema.findOne(email);
};
export const updateAdminbyId = ({ _id, ...rest }) => {
  return adminSchema.findByIdAndUpdate(_id, rest);
};
export const deleteAdmin = ({ _id }) => {
  return adminSchema.findByIdAndDelete(_id);
};
