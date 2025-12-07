"use client";

import { useTheme } from "next-themes";
import { use, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

// Promise that resolves after hydration
const mountedPromise = typeof window === "undefined" 
  ? Promise.resolve(true) 
  : new Promise<boolean>(resolve => {
      if (document.readyState === "complete") {
        resolve(true);
      } else {
        window.addEventListener("load", () => resolve(true), { once: true });
      }
    });

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Use React 19's use() for hydration check
  if (typeof window !== "undefined" && !mounted) {
    // Client-side immediate check
    if (document.readyState === "complete") {
      setMounted(true);
    } else {
      window.addEventListener("load", () => setMounted(true), { once: true });
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md transition-colors ${
          theme === "light"
            ? "bg-white text-yellow-600 shadow-sm dark:bg-gray-600"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md transition-colors ${
          theme === "dark"
            ? "bg-gray-800 text-blue-400 shadow-sm dark:bg-gray-600"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md transition-colors ${
          theme === "system"
            ? "bg-white text-purple-600 shadow-sm dark:bg-gray-600 dark:text-purple-400"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        title="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
