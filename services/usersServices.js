import { User } from "../schemas/usersSchema.js";
import { updateStatusContact } from "./contactsServices.js";
import httpError from "../helpers/HttpError.js";

export async function addUser(email, password, subscription) {
  return User.create({ email, password, subscription });
}

export async function findUserByEmail(email) {
  return User.find({ email });
}

export async function findUserByToken(token) {
  return User.find({ token });
}

export async function findUserById(id) {
  return User.findById(id);
}

export async function updateAuthToken(userID, token) {
  return User.findByIdAndUpdate(userID, { token }, { new: true });
}

export async function updateSubscription(userID, newSub) {
  return User.findByIdAndUpdate(
    userID,
    { subscription: newSub },
    { new: true }
  );
}
