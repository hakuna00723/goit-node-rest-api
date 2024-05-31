import {
  addUser,
  findUserByEmail,
  findUserByToken,
  updateAuthToken,
  updateSubscription,
  updateUserAvatar,
} from "../services/usersServices.js";
import bcrypt from "bcryptjs";
import httpError from "../helpers/HttpError.js";
import { newJWT } from "../helpers/jwt.js";
import { subsLevels } from "../constants/subsLevels.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { updateImageSize } from "../helpers/updateImageSize.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const user = await findUserByEmail(email);

    if (user.length > 0) {
      throw httpError(409, "Email already registered");
    }

    const avatarURL = gravatar.url(email, null, false);

    console.log(email);
    console.log(avatarURL);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = await addUser(
      email,
      hashedPassword,
      subscription,
      avatarURL
    );

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

export const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const avatarsDir = path.resolve("public", "avatars");

  try {
    if (!req.file) {
      throw httpError(400, "No avatar");
    }

    const { path: tempUpload, originalname } = req.file;

    const filename = `${id}_${originalname}`;
    const resultUpload = path.resolve(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const updatedUrl = path.join("avatars", filename);
    const updatedUser = await updateUserAvatar(id, updatedUrl);

    await updateImageSize(resultUpload);

    res.status(200).json({ avatarURL: updatedUser.avatarURL });
  } catch (e) {
    next(e);
  }
};
