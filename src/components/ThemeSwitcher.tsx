
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, PaintBucket } from "lucide-react";
import { AccentColor } from "@/contexts/AppContext";

export const ThemeSwitcher = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useApp();

  const accentColors: { value: AccentColor; label: string }[] = [
    { value: "purple", label: "Purple" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Pink" },
    { value: "teal", label: "Teal" },
    { value: "amber", label: "Amber" },
    { value: "red", label: "Red" },
    { value: "indigo", label: "Indigo" },
  ];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PaintBucket className="h-4 w-4" />
            <span className="sr-only">Change accent color</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={accentColor} onValueChange={(value) => setAccentColor(value as AccentColor)}>
            {accentColors.map((color) => (
              <DropdownMenuRadioItem
                key={color.value}
                value={color.value}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-3 w-3 rounded-full theme-${color.value}`}
                  style={{
                    backgroundColor: `hsl(var(--accent))`,
                  }}
                ></div>
                {color.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};
