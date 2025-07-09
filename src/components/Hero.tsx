import React from 'react'

interface HeroProps {
  [key: string]: any; // Or use a more specific type
}

const Hero: React.FC<HeroProps> = (props) => {
  const {
    title = 'Your Hero Title',
    subtitle = 'Your hero subtitle',
    buttonText = '',
    buttonUrl = '',
    buttonExternal = false,
    style = 'default'
  } = props;
  const getHeroClasses = () => {
    const baseClasses = 'hero min-h-[60vh] flex items-center'
    const styleClasses = {
      default: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
      dark: 'bg-gray-900 text-white',
      light: 'bg-gray-50 text-gray-900'
    } as const
    
    type StyleKey = keyof typeof styleClasses
    const validStyle = (style as StyleKey) in styleClasses ? (style as StyleKey) : 'default'
    
    return `${baseClasses} ${styleClasses[validStyle]}`
  }

  return (
    <section className={getHeroClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {subtitle}
          </p>
          {buttonText && buttonUrl && (
            <div className="space-x-4">
              <a
                href={buttonUrl}
                target={buttonExternal ? '_blank' : '_self'}
                rel={buttonExternal ? 'noopener noreferrer' : undefined}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
