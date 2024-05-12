import { promises as fs } from "fs";
import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const data = await listContacts();

  return data.filter((item) => item.id === contactId)[0] || null;
}

export async function removeContact(contactId) {
  const data = await listContacts();

  const response = data.filter((item) => item.id === contactId)[0] || null;

  const updatedData = data.filter((item) => item.id !== contactId) || null;

  if (updatedData && updatedData.length > 0) {
    await fs.writeFile(contactsPath, JSON.stringify(updatedData, null, 2));
  }

  return response;
}

export async function addContact(name, email, phone) {
  const data = await listContacts();

  const newUser = {
    id: String(Date.now()),
    name,
    email,
    phone,
  };

  data.push(newUser);

  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

  return newUser;
}

export async function changeContact(id, name, email, phone) {
  const contacts = await listContacts();
  const contactID = contacts.findIndex((contact) => contact.id === id);

  if (contactID === -1) {
    return null;
  }

  const updatedContact = {
    id,
    name: name || contacts[contactID].name,
    email: email || contacts[contactID].email,
    phone: phone || contacts[contactID].phone,
  };

  contacts[contactID] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return updatedContact;
}
