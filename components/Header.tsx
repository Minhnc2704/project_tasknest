"use client";

import {
  SignedOut,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-5 py-2">
      <Link href={"/dashboard"}>
        <h1 className="font-bold text-2xl">Dashboard</h1>
      </Link>

      {/* {user && (
        <h1 className="text-2xl">
          {user?.firstName}
          {`'s`} Space
        </h1>
      )} */}

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Header;
