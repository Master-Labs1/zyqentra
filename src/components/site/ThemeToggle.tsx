import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("zq-theme");if(t==="light"){document.documentElement.setAttribute("data-theme","light")}}catch(e){}})();`;

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    setLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);
  function toggle() {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("zq-theme", next ? "light" : "dark");
    } catch {
      /* storage unavailable */
    }
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title={light ? "Dark theme" : "Light theme"}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  );
}
