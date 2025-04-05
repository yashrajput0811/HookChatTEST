import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-xl shadow hover:opacity-80 transition"
    >
      {darkMode ? <Moon size={18} /> : <Sun size={18} />}
      <span className="text-sm">{darkMode ? "Dark" : "Light"}</span>
    </button>
  )
}

export default ThemeToggle
