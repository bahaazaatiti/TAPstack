import React from 'react'
import { WavyBackground } from './ui/wavy-background'
import { Button } from './ui/button'

interface WavyHeroProps {
  [key: string]: any;
}

const WavyHero: React.FC<WavyHeroProps> = (props) => {
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
    // Flat fields instead of nested waveSettings
    speed = 'fast',
    waveWidth = 50,
    blur = 10,
    waveOpacity = 0.5,
    backgroundFill = 'black',
    textColor = 'white',
    customTextColor = '#ffffff'
  } = props;

  // Use whichever version has a value
  const finalButtonText = buttonText || buttontext;
  const finalButtonUrl = buttonUrl || buttonurl;
  const finalButtonExternal = buttonExternal || buttonexternal;

  // Extract colors from the structure
  const colors = Array.isArray(waveColors) 
    ? waveColors.map(item => item.color || item).filter(Boolean)
    : ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'];

  // Determine text color
  const getTextColor = () => {
    switch (textColor) {
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black';
      case 'custom':
        return '';
      default:
        return 'text-white';
    }
  };

  const textColorClass = getTextColor();
  const customTextStyle = textColor === 'custom' ? { color: customTextColor } : {};

  return (
    <div className="relative min-h-[60vh] overflow-hidden">
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
        <div className={`text-center px-4 ${textColorClass}`} style={customTextStyle}>
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
              className="relative z-10 bg-white text-black hover:bg-gray-100 font-bold shadow-lg"
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
