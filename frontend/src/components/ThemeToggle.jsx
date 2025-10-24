import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import "./../styles/ThemeToggle.css"; 

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = systemPrefersDark ? "dark" : "light";
    }

    document.documentElement.classList.remove("light", "dark");
document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  return (
    <div className="theme-toggle">
      <button className="toggle-btn" onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Sun style={{color:"white"}} className="icon " /> : <Moon className="icon" />}
      </button>
    </div>
  );
}

export default ThemeToggle;

