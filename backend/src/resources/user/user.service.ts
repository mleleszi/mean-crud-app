import UserModel from "./user.model";
import token from "../../utils/token";

class UserService {
  private user = UserModel;

  public async register(
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const user = await this.user.create({ email, password, role });
      const accessToken = token.createToken(user);
      return accessToken;
    } catch (error) {
      throw new Error("Unable to create user");
    }
  }

  public async login(email: string, password: string): Promise<string | Error> {
    const user = await this.user.findOne({ email });
    if (!user) {
      throw new Error("Unable to find user with that email address");
    }
    if (await user.isValidPassword(password)) {
      return token.createToken(user);
    } else {
      return new Error("Wrong credentials given");
    }
  }
}

export default UserService;
