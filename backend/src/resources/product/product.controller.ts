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
    this.router.get(`${this.path}`, authenticated, this.findAll);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description, price, stock } = req.body;
      const product = await this.productService.save(
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

  private findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const page = Number(req.query.page);
      const size = Number(req.query.size);

      const products = await this.productService.findAll(page, size);
      res.status(200).json({ products });
    } catch (error) {
      next(new HttpException(400, "Cannot fetch products"));
    }
  };
}

export default ProductController;
