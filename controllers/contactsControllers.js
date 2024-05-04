import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateOneContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw new HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await removeContact(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw new HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedContact = await updateOneContact(id, name, email, phone);

    if (!updatedContact) {
      throw new HttpError(404);
    }

    if (!name && !email && !phone) {
      throw new HttpError(400, "Body must have at least one field");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
