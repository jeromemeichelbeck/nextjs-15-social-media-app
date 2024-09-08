import { validateRequest } from "@/auth";

export default async function Home() {
  const { session } = await validateRequest();
  return <main>Hello {session?.userId}</main>;
}
