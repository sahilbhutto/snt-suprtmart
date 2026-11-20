import * as Yup from "yup";
import { normalizePhone } from "../../../lib/phone";

export const registerSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Enter your full name")
    .max(60, "That name is too long")
    .matches(/^[\p{L}\s.'-]+$/u, "Use letters only")
    .required("Full name is required"),

  phone: Yup.string()
    .required("Mobile number is required")
    .test("pk-mobile", "Enter a valid mobile number, like 300 1234567", (value) => !!value && normalizePhone(value) !== null),

  email: Yup.string().trim().max(120, "That email is too long").email("Enter a valid email address"),

  referralCode: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9]{0,12}$/, "Use letters and numbers only"),

  acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms to create an account"),

  marketingOptIn: Yup.boolean(),

  website: Yup.string().max(0),
});
