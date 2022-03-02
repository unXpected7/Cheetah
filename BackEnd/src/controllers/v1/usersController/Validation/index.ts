import * as joi from "joi";
import { joiPassword } from "../../../../helpers";

export const VRegister = joiPassword.append({
  nickname: joi
    .string()
    .required()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9.\-_$*!]{3,30}$/)
    .messages({
      "string.pattern.base": "invalid nickname",
      "string.min": "nickname must be at least 3 characters",
      "string.max": "nickname must be at most 30 characters",
    }),
  email: joi.string().required().email(),
});

export const VLogin = joiPassword.append({
  email: joi.string().required().email(),
});

const uniqueContstraint = ["email", "nickname"];

export const isUnique = (msg: string) => {
  if (msg.toLowerCase().includes("unique")) {
    uniqueContstraint.forEach((constraint) => {
      if (msg.includes(constraint)) {
       msg = `${constraint} is already taken`;
      }
    })
  }
  return msg;
};
