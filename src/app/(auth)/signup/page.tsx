import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Signup",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="space-y10 w-full overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to bugbook</h1>
            <p className="text-muted-foreground">
              A place where even <em className="italic">you</em> can find a
              friend
            </p>
          </div>
          <div className="space-y-5">
            Sign up form
            <Link href="/login" className="block text-center hover:underline">
              Aready have an account? Login
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
