import { validateRequest } from "@/auth";
import PostEditor from "@/components/posts/editor/post-editor";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <main className="w-full">
      <PostEditor />
    </main>
  );
}
