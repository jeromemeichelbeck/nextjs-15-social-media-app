import { PrismaClient } from "@prisma/client";

const primseClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof primseClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? primseClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
