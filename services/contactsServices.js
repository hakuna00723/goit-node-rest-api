import { promises as fs } from "fs";
import path from "path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const removeIndex = allContacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (removeIndex === -1) {
    return null;
  }
  const [res] = allContacts.splice(removeIndex, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return res;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}
async function updateOneContact(id, newData) {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex === -1) {
      return null;
    }

    const updatedContact = { ...contacts[contactIndex], ...newData };
    contacts[contactIndex] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateOneContact,
};
