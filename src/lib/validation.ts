import { TypeOf, z } from "zod";

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

export const signupDefaultValues = {
  email: "",
  username: "",
  password: "",
} satisfies SignupValues;

// Login
export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const loginDefaultsValues = {
  username: "",
  password: "",
} satisfies LoginValues;

// Post
export const createPostSchema = z.object({
  content: requiredString,
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const createPostDefaultValues = {
  content: "",
} satisfies CreatePostValues;

// User
export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters").optional(),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
