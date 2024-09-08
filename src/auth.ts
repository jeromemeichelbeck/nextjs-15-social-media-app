import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User as DbUser } from "@prisma/client";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

const userAttributes = [
  "id",
  "username",
  "displayName",
  "avatarUrl",
  "googleId",
] as const satisfies (keyof DbUser)[];

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DbUser;
  }
}

const { session, user } = prisma;
const adapter = new PrismaAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return Object.fromEntries(
      userAttributes.map((key) => [key, databaseUserAttributes[key]]),
    ) as Pick<DbUser, (typeof userAttributes)[number]>;
  },
});

export const validateRequest = cache(
  async (): ReturnType<typeof lucia.validateSession> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (sessionId === null) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session !== null && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (result.session === null) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch (_e) {}

    return result;
  },
);
