import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
