import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    parentCat: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },

    name: {
      type: String,
      required: true,
      maxLength: 150,
    },

    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    salesStartDate: {
      type: Date,
      default: null,
    },
    salesEndDate: {
      type: Date,
      default: null,
    },
    salesPrice: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    thumbnail: {
      type: String,
      // required: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
