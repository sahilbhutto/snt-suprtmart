import * as Yup from "yup";
import { normalizePhone } from "../../../lib/phone";

export const loginSchema = Yup.object({
  phone: Yup.string()
    .required("Mobile number is required")
    .test("pk-mobile", "Enter a valid mobile number, like 300 1234567", (value) => !!value && normalizePhone(value) !== null),
  website: Yup.string().max(0),
});
