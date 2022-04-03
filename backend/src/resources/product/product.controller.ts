import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validate from "./product.validation";
import authenticated from "../../middleware/authenticated.middleware";
import ProductService from "./product.service";
import ProductModel from "./product.model";
import ProductSchema from "./product.model";

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
    this.router.get(`${this.path}/:id`, authenticated, this.findById);
    this.router.delete(`${this.path}/:id`, authenticated, this.deleteOne);
    this.router.put(`${this.path}/:id`, authenticated, this.updateOne);
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

  private findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const product = await this.productService.findOne(req.params.id);
      res.status(200).json({ product });
    } catch {
      return next(new HttpException(404, "Product not found"));
    }
  };

  private deleteOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    ProductModel.deleteOne({ _id: req.params.id }).then(
      (result) => {
        if (result.deletedCount > 0) {
          res.status(204).send({ message: "deleted" });
        } else {
          next(new HttpException(404, "Product not found"));
        }
      },
      () => {
        next(new HttpException(404, "Product not found"));
      }
    );
  };

  private updateOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const product = new ProductModel({
      _id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
    });

    ProductModel.updateOne({ _id: req.params.id }, product)
      .then((result) => {
        if (result.matchedCount > 0) {
          res.status(200).send("updated");
        } else {
          next(new HttpException(404, "Product not found"));
        }
      })
      .catch(() => {
        next(new HttpException(404, "Product not found"));
      });
  };
}

export default ProductController;
