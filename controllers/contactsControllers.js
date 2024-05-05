import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  changeContact,
} from "../services/contactsServices.js";

import httpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
      throw httpError(404, "Not Found");
    }
    res.status(200).json(contact);
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await removeContact(id);

    if (!removedContact) {
      throw httpError(404, "Not Found");
    }

    res.status(200).json(removedContact);
  } catch (e) {
    next(e);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const newContact = await addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedContact = await changeContact(id, name, email, phone);

    if (!updatedContact) {
      throw httpError(404, "Not found");
    }

    if (!name && !email && !phone) {
      throw httpError(400, "Body must have at least one field");
    }

    res.status(200).json(updatedContact);
  } catch (e) {
    next(e);
  }
};
