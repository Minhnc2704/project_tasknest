"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="bg-white h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6">
        <SignIn forceRedirectUrl="/dashboard" />
      </div>
    </section>
  );
}
