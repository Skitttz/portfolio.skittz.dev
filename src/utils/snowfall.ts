import { SNOWFALL_STORAGE_KEY } from "@/constants/snowfall";

const SNOWFALL_EVENT = "snowfall:change";
let enabledInMemory = true;

const isSnowing = () => {
  try {
    enabledInMemory = localStorage.getItem(SNOWFALL_STORAGE_KEY) !== "off";
  } catch {}
  return enabledInMemory;
};

const setSnow = (enabled: boolean) => {
  if (isSnowing() === enabled) return;

  enabledInMemory = enabled;
  try { localStorage.setItem(SNOWFALL_STORAGE_KEY, enabled ? "on" : "off"); } catch {}
  document.dispatchEvent(new CustomEvent(SNOWFALL_EVENT, { detail: { enabled } }));
};

export { SNOWFALL_EVENT, isSnowing, setSnow };
