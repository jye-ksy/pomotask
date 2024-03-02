import Link from "next/link";
import { SignInButton, SignOutButton, auth } from "@clerk/nextjs";

export async function Navbar() {
    const { userId } : { userId: string | null } = auth();
  
    return (
      <nav className="flex h-16 items-center gap-4 border-b px-8 lg:gap-8 z-2">
        <Link className="text-lg font-medium" href="">
          Pomotask
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium transition-colors ">
            {userId ? 
            <div className="flex items-center gap-4">
              <Link className="hover:text-gray-400" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-gray-400" href="/create/project">
                New Project
              </Link>
              <SignOutButton/> 
              </div>
            : <SignInButton />}
          </div>
        </div>
      </nav>
    );
  }