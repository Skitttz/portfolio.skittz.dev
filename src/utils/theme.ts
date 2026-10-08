type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const getTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const setTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const toggleTheme = () => setTheme(getTheme() === "dark" ? "light" : "dark");

export { getTheme, setTheme, toggleTheme };
export type { Theme };
