import { useEffect, useState } from 'react';
import { SnowfallElement } from './SnowfallElement';
import { SNOWFALL_EVENT, isSnowing } from '@/utils/snowfall';

export function SnowfallController() {
  const [enabled, setEnabled] = useState(isSnowing);

  useEffect(() => {
    const onChange = (event) => setEnabled(event.detail.enabled);

    document.addEventListener(SNOWFALL_EVENT, onChange);

    return () => document.removeEventListener(SNOWFALL_EVENT, onChange);
  }, []);

  return <SnowfallElement enabled={enabled} />;
}
