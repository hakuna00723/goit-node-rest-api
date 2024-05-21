import Joi from "joi";
import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

export const createContactSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  name: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const Contact = model("contact", contactSchema);
