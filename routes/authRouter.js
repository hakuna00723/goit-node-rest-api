import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/usersSchema.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  isUserLoggedIn,
  changeUserSub,
} from "../controllers/usersControllers.js";
import { authenticate } from "../helpers/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerUser);

authRouter.post("/login", validateBody(loginSchema), loginUser);

authRouter.post("/logout", authenticate, logoutUser);

authRouter.get("/current", authenticate, isUserLoggedIn);

authRouter.patch("/", authenticate, changeUserSub);

export default authRouter;
