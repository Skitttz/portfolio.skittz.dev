import { Snowfall } from 'react-snowfall';

export default function SnowfallComponent({ enabled }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: enabled ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      {enabled && (
        <Snowfall
          snowflakeCount={200}
          style={{
            width: '100vw',
            height: '100vh',
          }}
        />
      )}
    </div>
  );
}
