import CategorySchema from "./CategorySchema.js";

export const insertCategory = (obj) => {
  return CategorySchema(obj).save();
};

//@filter, @updateObj must be an obj
export const updateCategory = (filter, updateObj) => {
  return CategorySchema.findOneAndUpdate(filter, updateObj, { new: true });
};
export const deleteCategory = ({ _id }) => {
  return CategorySchema.findByIdAndDelete(_id);
};
