import BookmarksFeed from "@/app/(main)/bookmarks/bookmarks-feed";
import TrendsSidebar from "@/components/trends-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarksFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
