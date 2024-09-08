import { validateRequest } from "@/auth";

export default async function Home() {
  const { user } = await validateRequest();
  return <main>Hello {user?.displayName}</main>;
}
