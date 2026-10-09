import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SnowfallElement } from './SnowfallElement';
import { SNOWFALL_EVENT, isSnowing } from '@/utils/snowfall';
import { TERMINAL_MODE_EVENT } from '@/utils/terminal-mode';

const terminalSnowHost = () => document.querySelector('[data-terminal-mode][open] [data-terminal-snow]');

export function SnowfallController() {
  const [enabled, setEnabled] = useState(isSnowing);
  const [host, setHost] = useState(terminalSnowHost);

  useEffect(() => {
    const onChange = (event) => setEnabled(event.detail.enabled);
    const syncHost = () => setHost(terminalSnowHost());

    document.addEventListener(SNOWFALL_EVENT, onChange);
    document.addEventListener(TERMINAL_MODE_EVENT, syncHost);
    document.addEventListener('astro:after-swap', syncHost);
    syncHost();

    return () => {
      document.removeEventListener(SNOWFALL_EVENT, onChange);
      document.removeEventListener(TERMINAL_MODE_EVENT, syncHost);
      document.removeEventListener('astro:after-swap', syncHost);
    };
  }, []);

  const snow = <SnowfallElement enabled={enabled} />;
  return host ? createPortal(snow, host) : snow;
}
