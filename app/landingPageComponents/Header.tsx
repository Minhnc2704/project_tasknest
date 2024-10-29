"use client"; // Ensure this component can use hooks and manage state

import { useUser } from "@clerk/nextjs"; // Import the useUser hook from Clerk
import { useRouter } from "next/navigation"; // Use 'next/navigation' for app directory

function Header() {
  const { isSignedIn } = useUser(); // Get the user's sign-in status from Clerk
  const router = useRouter(); // Initialize the Next.js router

  const handleGetStarted = () => {
    if (!isSignedIn) {
      // If the user is not signed in, redirect to the sign-in page
      router.push("/sign-in");
    } else {
      // If the user is signed in, redirect to the dashboard
      router.push("/dashboard");
    }
  };

  return (
    <header className="bg-white text-black py-4 shadow-md">
      <div className="px-5">
        <nav className="w-full flex items-center justify-between">
          {/* Logo and Website Name */}
          <div className="flex items-center gap-3">
            {/* Uncomment and insert your logo here */}
            {/* <Logo /> */}
            <h1 className="text-lg font-bold">TaskNest</h1>
          </div>

          {/* Get Started Button */}
          <div>
            <button
              onClick={handleGetStarted}
              className="relative flex h-9 items-center justify-center px-4 bg-black rounded-full hover:bg-gray-800 transition duration-300"
            >
              <span className="relative text-sm font-semibold text-white">
                Get Started
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
