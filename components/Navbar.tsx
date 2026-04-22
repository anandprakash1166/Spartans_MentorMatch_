"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Compass } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Discover", href: "/", icon: Compass },
    { name: "My Sessions", href: "/sessions", icon: Calendar },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 hidden sm:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Mentors.ai</span>
              </div>
            </div>
            <nav className="ml-8 flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      isActive
                        ? "border-indigo-600 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                JS
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
