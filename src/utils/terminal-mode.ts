const TERMINAL_MODE_KEY = "terminal-mode";
const TERMINAL_MODE_EVENT = "terminal-mode:change";
let preferredMode = false;

const isTerminalMode = () => {
  try {
    preferredMode = localStorage.getItem(TERMINAL_MODE_KEY) === "open";
  } catch {}
  return preferredMode;
};

const setTerminalMode = (enabled: boolean) => {
  preferredMode = enabled;
  try {
    if (enabled) localStorage.setItem(TERMINAL_MODE_KEY, "open");
    else localStorage.removeItem(TERMINAL_MODE_KEY);
  } catch {}
  document.dispatchEvent(new Event(TERMINAL_MODE_EVENT));
};

export { TERMINAL_MODE_EVENT, isTerminalMode, setTerminalMode };
