"use client";

import { db } from "@/firebase";
import { UserButton, useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import Logo from "./Logo";

function Header() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user]);

  /* Save user data */
  const saveUserData = async () => {
    const docId = user?.emailAddresses?.[0]?.toString();

    if (!docId) {
      console.error("No valid email address found.");
      return;
    }

    try {
      await setDoc(doc(db, "users", docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      });
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 shadow-sm">
      <Logo />
      <UserButton />
    </div>
  );
}

export default Header;
