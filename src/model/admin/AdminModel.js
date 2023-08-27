import adminSchema from "./AdminSchema.js";

export const insertAdmin = (obj) => {
  return adminSchema(obj).save();
};
export const getAdminByEmail = (email) => {
  return adminSchema.findOne(email);
};
export const getAdminById = (_id) => {
  return adminSchema.findOne({ _id });
};
export const getAdminDisplay = () => {
  return adminSchema.find();
};
export const getOneAdmin = (filter) => {
  return adminSchema.findOne(filter);
};
export const updateAdminById = (_id, ...rest) => {
  return adminSchema.findByIdAndUpdate(_id, rest);
};
//@filter, @updateObj must be an obj
export const updateAdmin = (filter, updateObj) => {
  return adminSchema.findOneAndUpdate(filter, updateObj, { new: true });
};
export const deleteAdmin = ({ _id }) => {
  return adminSchema.findByIdAndDelete(_id);
};
