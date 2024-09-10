import { Prisma } from "@prisma/client";

export const postDataInclude = {
  author: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
