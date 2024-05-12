import Joi from "joi";

export const createContactSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  name: Joi.string(),
  phone: Joi.string(),
});
