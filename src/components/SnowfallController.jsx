import { useEffect, useState } from 'react';
import SnowfallComponent from './Snow';

export const SNOWFALL_STORAGE_KEY = 'snowfall';

function getInitialValue() {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SNOWFALL_STORAGE_KEY);
  return stored === null || stored === 'on';
}

export function SnowfallController() {
  const [enabled, setEnabled] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(SNOWFALL_STORAGE_KEY, enabled ? 'on' : 'off');

    window.toggleSnowfall = () => {
      setEnabled((prev) => !prev);
    };

    return () => {
      delete window.toggleSnowfall;
    };
  }, [enabled]);

  return <SnowfallComponent enabled={enabled} />;
}
