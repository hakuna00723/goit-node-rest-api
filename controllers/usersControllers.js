import {
  addUser,
  findUserByEmail,
  findUserById,
  findUserByToken,
  updateAuthToken,
  updateSubscription,
} from "../services/usersServices.js";
import bcrypt from "bcryptjs";
import httpError from "../helpers/HttpError.js";
import { newJWT } from "../helpers/jwt.js";
import { subsLevels } from "../constants/subsLevels.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = await addUser(email, hashedPassword, subscription);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (user.length === 0) {
      throw httpError(401, "Email or password is wrong");
    }

    const [
      {
        email: userEmail,
        subscription: userSubscription,
        password: userPassword,
      },
    ] = user;

    const isPasswordCorrect = await bcrypt.compareSync(password, userPassword);

    if (!isPasswordCorrect) {
      throw httpError(401, "Email or password is wrong");
    }

    const token = newJWT({ id: user[0].id });
    await updateAuthToken(user[0].id, token);

    res.status(200).json({
      token: token,
      user: {
        email: userEmail,
        subscription: userSubscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { id } = req.user;

    await updateAuthToken(id, null);

    res.status(204).json({
      message: "Not authorized",
    });
  } catch (e) {
    next(e);
  }
};

export const isUserLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.user;

    const user = await findUserByToken(token);

    const [{ email, subscription }] = user;

    console.log(user);

    if (!user) {
      throw httpError(401);
    }

    res.status(200).json({
      email,
      subscription,
    });
  } catch (e) {
    next(e);
  }
};

export const changeUserSub = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription: newSub } = req.body;

    if (!Object.values(subsLevels).includes(newSub)) {
      throw httpError(418, "Subscription not found");
    }

    if (!id) {
      throw httpError(404, "User doesnt exists");
    }

    const user = await updateSubscription(id, newSub);

    const { email: userEmail, subscription: userSubscription } = user;

    res.status(200).json({
      message: "Subscription successfully updated",
      user: {
        email: userEmail,
        subscription: userSubscription,
      },
    });
  } catch (e) {
    next(e);
  }
};
