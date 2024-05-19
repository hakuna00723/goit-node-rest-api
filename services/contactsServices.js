import { Contact } from "../schemas/contactsSchemas.js";

export async function listContacts(filter, options) {
  return Contact.find(filter)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);
}

export async function getContactById(filters) {
  return Contact.findOne(filters);
}

export async function removeContact(filters) {
  return Contact.findOneAndDelete(filters);
}

export async function addContact(name, email, phone, favorite, owner) {
  return Contact.create({ name, email, phone, favorite, owner });
}

export async function changeContact(filters, name, email, phone, favorite) {
  return Contact.findOneAndUpdate(
    filters,
    { name, email, phone, favorite },
    { new: true }
  );
}

export async function updateStatusContact(filters, favorite) {
  return Contact.findOneAndUpdate(filters, { favorite }, { new: true });
}
