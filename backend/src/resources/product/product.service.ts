import ProductModel from "./product.model";
import Product from "./product.interface";

class ProductService {
  private product = ProductModel;

  public async save(
    name: string,
    description: string,
    price: number,
    stock: number
  ): Promise<Product> {
    try {
      const product = await this.product.create({
        name,
        description,
        price,
        stock,
      });
      return product;
    } catch (error) {
      throw new Error("Unable to create product!");
    }
  }

  public async findAll(page: number, size: number): Promise<Product[]> {
    try {
      let fetchedProducts: Product[];

      if (!isNaN(page) && !isNaN(size)) {
        fetchedProducts = await this.product
          .find()
          .skip(size * (page - 1))
          .limit(size);
      } else {
        fetchedProducts = await this.product.find();
      }

      return fetchedProducts;
    } catch {
      throw new Error("Unable to fetch products!");
    }
  }
}

export default ProductService;
