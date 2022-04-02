import ProductModel from "./product.model";
import Product from "./product.interface";

class ProductService {
  private product = ProductModel;

  public async create(name: string, description: string, price: number, stock: number): Promise<Product> {
    try {
      const product = await this.product.create({ name, description, price, stock });
      return product;
    } catch (error) {
      throw new Error("Unable to create product!");
    }
  }
}

export default ProductService;
