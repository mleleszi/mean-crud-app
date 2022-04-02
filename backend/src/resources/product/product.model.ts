import { Schema, model } from "mongoose";
import Product from "./product.interface";

const ProductSchema = new Schema(
  {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<Product>("Product", ProductSchema);
