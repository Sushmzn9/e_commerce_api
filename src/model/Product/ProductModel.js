import productSchema from "./ProductSchema.js";

export const insertproduct = (obj) => {
  return productSchema(obj).save();
};
export const getproduct = () => {
  return productSchema.find();
};
export const updateproductById = ({ _id, ...rest }) => {
  return productSchema.findByIdAndUpdate(_id, rest);
};
//@filter, @updateObj must be an obj
export const updateproduct = (filter, updateObj) => {
  return productSchema.findOneAndUpdate(filter, updateObj, { new: true });
};
export const deleteproductById = (_id) => {
  return productSchema.findByIdAndDelete(_id);
};

export const findOneproductByFilter = (filter) => {
  return productSchema.findOne(filter);
};
