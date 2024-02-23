import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";

async function Navbar() {
  const { userId } = auth();

  return (
    <nav className="flex h-16 items-center gap-4 border-b px-4 lg:gap-8">
      <Link className="text-lg font-medium" href="#">
        Pomotask
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-sm font-medium underline transition-colors hover:text-gray-900">
          {userId ? <SignInButton /> : <SignOutButton />}
        </div>
      </div>
    </nav>
  );
}
export default async function Home() {
  noStore();

  return (
    <main className="min-h-screen ">
      <Navbar />
    </main>
  );
}
