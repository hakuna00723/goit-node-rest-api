import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  changeContact,
  updateStatusContact,
} from "../services/contactsServices.js";
import httpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      favorite = undefined,
      page = undefined,
      limit = undefined,
    } = req.query;

    const filter = { owner: id };

    if (favorite !== undefined) {
      filter.owner = id;
      filter.favorite = favorite;
    }

    const options = {
      page: +page,
      limit: +limit,
    };

    const contacts = await listContacts(filter, options);

    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { id } = req.params;

    const filters = { _id: id, owner };

    const contact = await getContactById(filters);

    if (!contact) {
      throw httpError(404);
    }
    res.status(200).json(contact);
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;

    const { id } = req.params;

    const filters = { _id: id, owner };

    const removedContact = await removeContact(filters);

    if (!removedContact) {
      throw httpError(404);
    }

    res.status(200).json(removedContact);
  } catch (e) {
    next(e);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const { _id: owner } = req.user;

    const newContact = await addContact(name, email, phone, favorite, owner);

    res.status(201).json(newContact);
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const filters = { _id: id, owner };

    const { name, email, phone, favorite } = req.body;
    const updatedContact = await changeContact(
      filters,
      name,
      email,
      phone,
      favorite
    );

    if (!updatedContact) {
      throw httpError(404);
    }

    res.status(200).json(updatedContact);
  } catch (e) {
    next(e);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const { _id: owner } = req.user;

    const filters = { _id: id, owner };

    const updatedContact = await updateStatusContact(filters, favorite);

    if (!updatedContact) {
      throw httpError(404);
    }

    res.status(200).json(updatedContact);
  } catch (e) {
    next(e);
  }
};
