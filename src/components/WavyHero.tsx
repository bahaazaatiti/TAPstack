import React, { useEffect, useState } from 'react'
import { WavyBackground } from './ui/wavy-background'
import { Button } from './ui/button'

interface WavyHeroProps {
  [key: string]: any;
}

const WavyHero: React.FC<WavyHeroProps> = (props) => {
  // Get theme-aware background color
  const [backgroundFill, setBackgroundFill] = useState('white');
  
  useEffect(() => {
    const updateBackgroundColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const color = isDark ? '#0a0a0a' : '#ffffff'; // Use simple hex colors
      console.log('Theme detected:', isDark ? 'dark' : 'light', 'Setting color:', color);
      setBackgroundFill(color);
    };
    
    // Set initial color
    updateBackgroundColor();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateBackgroundColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const {
    title = 'Your Hero Title',
    subtitle = 'Your hero subtitle',
    buttonText = '',
    buttonUrl = '',
    // Also handle lowercase versions from Kirby
    buttontext = '',
    buttonurl = '',
    buttonexternal = false,
    buttonExternal = false,
    waveColors = [
      { color: '#38bdf8' },
      { color: '#818cf8' },
      { color: '#c084fc' },
      { color: '#e879f9' },
      { color: '#22d3ee' }
    ],
    // Also handle lowercase version from Kirby
    wavecolors = [],
    // Flat fields instead of nested waveSettings
    speed = 'fast',
    waveWidth = 50,
    blur = 10,
    waveOpacity = 0.5
  } = props;

  // Use whichever version has a value
  const finalButtonText = buttonText || buttontext;
  const finalButtonUrl = buttonUrl || buttonurl;
  const finalButtonExternal = buttonExternal || buttonexternal;

  // Use whichever wave colors version has data
  const finalWaveColors = (wavecolors && wavecolors.length > 0) ? wavecolors : waveColors;

  // Extract colors from the structure
  const colors = Array.isArray(finalWaveColors) 
    ? finalWaveColors.map(item => item.color || item).filter(Boolean)
    : ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'];

  return (
    <div className="relative min-h-[60vh] overflow-hidden bg-background">
      <WavyBackground
        className="max-w-4xl mx-auto pb-40"
        containerClassName="min-h-[60vh] relative"
        colors={colors}
        waveWidth={waveWidth}
        backgroundFill={backgroundFill}
        blur={blur}
        speed={speed}
        waveOpacity={waveOpacity}
      >
        <div className="text-center px-4 text-foreground">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {subtitle}
          </p>
          <div className="space-x-4">
            <Button 
              asChild
              size="lg"
              className="relative z-10"
            >
              <a
                href={finalButtonUrl || '#'}
                target={finalButtonExternal ? '_blank' : '_self'}
                rel={finalButtonExternal ? 'noopener noreferrer' : undefined}
              >
                {finalButtonText || 'Get Started'}
              </a>
            </Button>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default WavyHero;
