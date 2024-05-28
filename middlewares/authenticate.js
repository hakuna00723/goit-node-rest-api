import httpError from "../helpers/HttpError.js";
import { isJwtValid } from "../helpers/jwt.js";
import { User } from "../schemas/usersSchema.js";

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(httpError(401));
  }

  try {
    const { id } = isJwtValid(token);

    const user = await User.findById(id);

    if (!user?.token || user.token !== token) {
      next(httpError(401));
    }
    req.user = user;
    next();
  } catch (e) {
    next(httpError(401));
  }
};
