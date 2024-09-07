import { z } from "zod";

// utils
const requiredString = z.string().trim().min(1, "Required");

// Sign up
export const signupSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-z0-9_-]+$/,
    "Only letters, numbers, - or _ are allowed",
  ),
  password: requiredString.min(8, "Must be a least 8 characters"),
});

export type SignupValues = z.infer<typeof signupSchema>;

// Login
export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;
