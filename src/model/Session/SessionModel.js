import SessionSchema from "./SessionSchema.js";

export const insertNewSession = (obj) => {
  return SessionSchema(obj).save();
};
