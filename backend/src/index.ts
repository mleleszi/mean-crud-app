import "dotenv/config";
import App from "./app";
import UserController from "./resources/user/user.controller";
import ProductController from "./resources/product/product.controller";

const app = new App(
  [new UserController(), new ProductController()],
  Number(process.env.PORT)
);

app.listen();
