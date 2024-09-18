"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedData = updateUserProfileSchema.parse(values);
  const { user } = await validateRequest();

  if (user === null) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    select: getUserDataSelect(user.id),
    data: validatedData,
  });

  return updatedUser;
}
