import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 mr-2 rounded-full hidden sm:flex items-center justify-center transition-colors bg-white hover:bg-slate-100 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 text-slate-600 dark:text-slate-300 relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 transition-all duration-300 dark:-rotate-90 dark:opacity-0" />
      <Moon className="absolute h-4 w-4 rotate-90 opacity-0 transition-all duration-300 dark:rotate-0 dark:opacity-100" />
    </button>
  )
}
