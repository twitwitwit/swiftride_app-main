import React, { useState } from 'react';
import emblemImg from '../../assets/images/swiftride_emblem_graphic_1787614817859.png';

export interface SwiftRideLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon-only' | 'horizontal' | 'text-only';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

/**
 * Renders the "SwiftRide" brand wordmark in the authentic FC Fast typeface
 */
export const SwiftRideWordmark: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: 'dark' | 'light';
  className?: string;
}> = ({ size = 'md', theme = 'light', className = '' }) => {
  const getWordmarkSize = () => {
    switch (size) {
      case 'xs': return 'text-xs tracking-wide';
      case 'sm': return 'text-sm tracking-wide';
      case 'md': return 'text-lg sm:text-xl tracking-wide';
      case 'lg': return 'text-2xl sm:text-3xl tracking-wide';
      case 'xl': return 'text-3xl sm:text-4xl tracking-wider';
      case '2xl': return 'text-5xl sm:text-6xl tracking-wider';
    }
  };

  const isDark = theme === 'dark';

  return (
    <span className={`font-fc-fast font-bold uppercase italic select-none inline-flex items-center leading-none ${getWordmarkSize()} ${className}`}>
      <span className={isDark ? 'text-white' : 'text-slate-950'}>SWIFT</span>
      <span className="text-amber-500 ml-0.5">RIDE</span>
    </span>
  );
};

export const SwiftRideLogo: React.FC<SwiftRideLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  className = '',
  theme = 'light'
}) => {
  const [emblemError, setEmblemError] = useState(false);

  // Height mappings based on size
  const getEmblemHeight = () => {
    switch (size) {
      case 'xs': return 'h-6';
      case 'sm': return 'h-8';
      case 'md': return 'h-11';
      case 'lg': return 'h-16';
      case 'xl': return 'h-24';
      case '2xl': return 'h-32';
    }
  };

  const getFullBadgeHeight = () => {
    switch (size) {
      case 'xs': return 'h-10';
      case 'sm': return 'h-14';
      case 'md': return 'h-20';
      case 'lg': return 'h-28';
      case 'xl': return 'h-36';
      case '2xl': return 'h-48';
    }
  };

  const getSubtitleSize = () => {
    switch (size) {
      case 'xs': return 'text-[7px]';
      case 'sm': return 'text-[8px]';
      case 'md': return 'text-[10px]';
      case 'lg': return 'text-xs';
      case 'xl': return 'text-sm';
      case '2xl': return 'text-base';
    }
  };

  // 1. Text-Only Variant (Using FC Fast Font)
  if (variant === 'text-only') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <SwiftRideWordmark size={size} theme={theme} />
        {showSubtitle && (
          <span className={`font-mono font-bold tracking-widest uppercase mt-1 ${getSubtitleSize()} ${
            theme === 'dark' ? 'text-amber-400' : 'text-slate-600'
          }`}>
            Fast and Safe Travel
          </span>
        )}
      </div>
    );
  }

  // 2. Icon-Only Variant (Emblem graphic)
  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        {!emblemError ? (
          <div className={`${getEmblemHeight()} flex items-center justify-center`}>
            <img
              src={emblemImg}
              alt="SwiftRide Emblem"
              className="h-full w-auto object-contain drop-shadow-md"
              onError={() => setEmblemError(true)}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className={`${getEmblemHeight()} aspect-[16/9] bg-slate-900 rounded-lg flex items-center justify-center text-amber-400 font-fc-fast font-bold text-xs`}>
            SR
          </div>
        )}
      </div>
    );
  }

  // 3. Full Hero Badge (Emblem on top + FC Fast SwiftRide Wordmark below + Subtitle)
  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
        <div className="relative group flex flex-col items-center max-w-full">
          {/* Emblem Artwork */}
          <div className={`${getFullBadgeHeight()} w-auto flex items-center justify-center p-1 relative`}>
            {!emblemError ? (
              <img
                src={emblemImg}
                alt="SwiftRide Vehicle Speed Emblem"
                className="max-h-full max-w-full object-contain drop-shadow-xl"
                onError={() => setEmblemError(true)}
                referrerPolicy="no-referrer"
              />
            ) : null}
          </div>

          {/* Text Wordmark in FC Fast Font */}
          <div className="mt-2 flex flex-col items-center">
            <SwiftRideWordmark size={size} theme={theme} />

            {showSubtitle && (
              <span className={`font-mono font-extrabold tracking-widest uppercase mt-1 ${getSubtitleSize()} ${
                theme === 'dark' ? 'text-amber-400' : 'text-slate-700'
              }`}>
                Safe &bull; Reliable &bull; Convenient
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Horizontal Variant (Emblem Left + FC Fast SwiftRide Wordmark Right)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Emblem Graphic */}
      <div className={`${getEmblemHeight()} flex items-center justify-center shrink-0`}>
        {!emblemError ? (
          <img
            src={emblemImg}
            alt="SwiftRide Logo"
            className="h-full w-auto object-contain drop-shadow-sm"
            onError={() => setEmblemError(true)}
            referrerPolicy="no-referrer"
          />
        ) : null}
      </div>

      {/* Text Wordmark in FC Fast Font */}
      <div className="flex flex-col items-start leading-none justify-center">
        <SwiftRideWordmark size={size} theme={theme} />

        {showSubtitle && (
          <span className={`font-mono font-semibold tracking-wider uppercase mt-1 ${getSubtitleSize()} ${
            theme === 'dark' ? 'text-amber-400/90' : 'text-slate-500'
          }`}>
            Ride-Hailing System
          </span>
        )}
      </div>
    </div>
  );
};
