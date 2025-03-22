import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-[url('/bgofsidebar.png')] bg-cover bg-center bg-scroll p-4 shadow-md flex flex-col">
      {/* Logo at the top */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 w-full overflow-hidden -ml-2">
          <div className="w-18 h-18">
            <Image src="/logo-c.png" alt="Logo" width={100} height={100} className="object-contain" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-wide whitespace-nowrap">SolarFlow</h1>
        </div>

        {/* Navigation menu */}
        <ul className="space-y-2 text-white pl-2">
          <li>
            <Link
              href="/"
              className="font-bold block py-2 px-3 rounded-md transition-all duration-200 hover:bg-white/20"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="font-bold block py-2 px-3 rounded-md transition-all duration-200 hover:bg-white/20"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/transactions"
              className="font-bold block py-2 px-3 rounded-md transition-all duration-200 hover:bg-white/20"
            >
              Transactions
            </Link>
          </li>
          <li>
            <Link
              href="/billing"
              className="font-bold block py-2 px-3 rounded-md transition-all duration-200 hover:bg-white/20"
            >
              Billing
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="font-bold block py-2 px-3 rounded-md transition-all duration-200 hover:bg-white/20"
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/logout"
              className="font-bold block py-2 px-3 rounded-md transition-all duration-200 hover:bg-white/20"
            >
              Log Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Optional: Add a small footer here if needed */}
    </aside>
  );
};
