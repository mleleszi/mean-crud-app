import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validate from "./product.validation";
import authenticated from "../../middleware/authenticated.middleware";
import ProductService from "./product.service";

class ProductController implements Controller {
  public path = "/product";
  public router = Router();
  private productService = new ProductService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}`,
      authenticated,
      validationMiddleware(validate.create),
      this.create
    );
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description, price, stock } = req.body;
      const product = await this.productService.create(
        name,
        description,
        price,
        stock
      );
      res.status(201).json({ product });
    } catch (error) {
      next(new HttpException(400, "Cannot create product"));
    }
  };
}

export default ProductController;
