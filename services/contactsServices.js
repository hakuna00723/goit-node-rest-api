import { Contact } from "../schemas/contact.js";

export async function listContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export async function addContact(name, email, phone, favorite) {
  return Contact.create({ name, email, phone, favorite });
}

export async function changeContact(contactID, name, email, phone, favorite) {
  return Contact.findByIdAndUpdate(
    contactID,
    { contactID, name, email, phone, favorite },
    { new: true }
  );
}

export async function updateStatusContact(contactID, favorite) {
  return Contact.findByIdAndUpdate(contactID, { favorite }, { new: true });
}
