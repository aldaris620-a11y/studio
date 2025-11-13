import { ImageResponse } from 'next/og';
import { Gamepad2 } from 'lucide-react';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#4682B4',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '6px',
        }}
      >
        <Gamepad2 size={20} />
      </div>
    ),
    {
      ...size,
    }
  );
}
