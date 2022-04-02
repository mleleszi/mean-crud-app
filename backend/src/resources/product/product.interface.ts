import { Document } from "mongoose";

export default interface Product extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
}
