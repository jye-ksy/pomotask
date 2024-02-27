import Link from "next/link";
import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";

export async function Navbar() {
    const { userId } = auth();
  
    return (
      <nav className="flex h-16 items-center gap-4 border-b px-8 lg:gap-8">
        <Link className="text-lg font-medium" href="#">
          Pomotask
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium underline transition-colors hover:text-gray-900">
            {userId ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </nav>
    );
  }