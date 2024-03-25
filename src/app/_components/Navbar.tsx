import Link from "next/link";
import { SignInButton, SignOutButton, UserButton, auth } from "@clerk/nextjs";

export async function Navbar() {
  const { userId }: { userId: string | null } = auth();

  return (
    <nav className="z-2 flex h-16 items-center justify-center gap-4  px-8 lg:gap-8">
      <div className="mt-1 flex w-full max-w-7xl items-center border-b px-1 py-4">
        <Link className="text-lg font-medium" href="">
          Pomotask
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium transition-colors ">
            {userId ? (
              <div className="flex items-center gap-4">
                <Link className="hover:text-gray-400" href="/dashboard">
                  Dashboard
                </Link>
                <div className="ml-auto">
                  <UserButton afterSignOutUrl="/" />
                </div>
                {/* <SignOutButton/>  */}
              </div>
            ) : (
              <Link className="hover:text-gray-400" href="sign-in">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
