import { SNOWFALL_STORAGE_KEY } from "@/constants/snowfall";

const SNOWFALL_EVENT = "snowfall:change";

const isSnowing = () => localStorage.getItem(SNOWFALL_STORAGE_KEY) !== "off";

const setSnow = (enabled: boolean) => {
  if (isSnowing() === enabled) return;

  localStorage.setItem(SNOWFALL_STORAGE_KEY, enabled ? "on" : "off");
  document.dispatchEvent(new CustomEvent(SNOWFALL_EVENT, { detail: { enabled } }));
};

export { SNOWFALL_EVENT, isSnowing, setSnow };
