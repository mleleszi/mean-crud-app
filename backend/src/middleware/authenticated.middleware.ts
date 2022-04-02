import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import UserModel from "../resources/user/user.model";
import Token from "../utils/interfaces/token.interface";
import HttpException from "../utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

const authenticatedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorised"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();

  try {
    const payLoad: Token | jwt.JsonWebTokenError = await verifyToken(
      accessToken
    );
    if (payLoad instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Unauthorised"));
    }

    const user = await UserModel.findById(payLoad.id)
      .select("-password")
      .exec();

    if (!user) {
      return next(new HttpException(401, "Unauthorised"));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorised"));
  }
};

export default authenticatedMiddleware;
