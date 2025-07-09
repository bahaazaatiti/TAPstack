import React, { useState } from 'react'

interface Link {
  title: string
  url: string
  external: boolean
}

interface NavbarProps {
  logo?: string
  links?: Link[]
  style?: 'default' | 'dark' | 'light'
}

const Navbar: React.FC<NavbarProps> = ({ 
  logo = 'Your Site', 
  links = [], 
  style = 'default' 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getNavbarClasses = () => {
    const baseClasses = 'navbar'
    const styleClasses = {
      default: 'bg-white shadow-sm border-b border-gray-200 text-gray-900',
      dark: 'bg-gray-900 text-white shadow-sm',
      light: 'bg-gray-50 text-gray-900 shadow-sm'
    }
    return `${baseClasses} ${styleClasses[style] || styleClasses.default}`
  }

  return (
    <nav className={getNavbarClasses()}>
      <div className="navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-content flex justify-between items-center h-16">
          {/* Logo */}
          <div className="navbar-logo">
            <h1 className="text-xl font-bold">{logo}</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="navbar-links flex items-baseline space-x-4">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target={link.external ? '_blank' : '_self'}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="navbar-link px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="navbar-mobile-toggle p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {!mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="navbar-mobile md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target={link.external ? '_blank' : '_self'}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="navbar-link-mobile block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
