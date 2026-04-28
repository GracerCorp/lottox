'use client';

import React, { useEffect, useRef } from 'react';

export interface AdSenseSlotProps {
  position: 'top' | 'middle' | 'bottom';
  adClient?: string;
  adSlot?: string;
  className?: string;
}

export default function AdSenseSlot({
  position,
  adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || '',
  className = '',
}: AdSenseSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Only push if we haven't initialized this slot yet
    if (!initialized.current && typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as Window & typeof globalThis & { adsbygoogle?: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  // Minimum heights to prevent Cumulative Layout Shift (CLS)
  const minHeights = {
    top: 'min-h-[100px] md:min-h-[90px]', // Typically for responsive leaderboards
    middle: 'min-h-[250px]', // Typically for medium rectangles
    bottom: 'min-h-[250px]',
  };

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center my-6 rounded-xl ${minHeights[position]} ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
