import React, { useState, useEffect } from "react"
import { useId } from "react"
import {
  GlobeIcon,
  HomeIcon,
} from "lucide-react"

import ThemeToggle from "@/components/ui/theme-toggle"
import SiteSearch from "@/components/ui/site-search"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Comp582Props {
  [key: string]: any
}

const Comp582: React.FC<Comp582Props> = (props) => {
  const {
    logolight = null,
    logodark = null,
    logotext = 'Logo',
    sitepages = [],
    languages = [],
    defaultlanguage = 'en',
    shownavigation = true,
    showthemetoggle = true,
    showlanguageselector = true,
  } = props

  // Debug logging
  console.log('Comp582 props:', props)

  const id = useId()
  const [currentLanguage, setCurrentLanguage] = useState(defaultlanguage)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Get current language from URL or default
    const path = window.location.pathname
    const langCode = path.split('/')[1]
    
    // Check if the first path segment is a valid language code
    const validLanguages = languages.map((lang: any) => lang.value)
    if (validLanguages.includes(langCode)) {
      setCurrentLanguage(langCode)
    } else {
      setCurrentLanguage(defaultlanguage)
    }
  }, [languages, defaultlanguage])

  const handleLanguageChange = (language: string) => {
    // Redirect to the new language URL using Kirby's language system
    const currentPath = window.location.pathname
    const pathParts = currentPath.split('/').filter(part => part !== '')
    
    // Remove existing language code if present
    const validLanguages = languages.map((lang: any) => lang.value)
    if (pathParts.length > 0 && validLanguages.includes(pathParts[0])) {
      pathParts.shift()
    }
    
    // Construct new URL with language prefix
    let newPath = '/'
    if (language !== defaultlanguage) {
      newPath += language + '/'
    }
    newPath += pathParts.join('/')
    
    // Redirect to new language URL
    window.location.href = newPath
  }

  // Handle logo data structure (single object or array)
  const logolightData = Array.isArray(logolight) ? logolight[0] : logolight
  const logodarkData = Array.isArray(logodark) ? logodark[0] : logodark

  // Debug logo data
  console.log('Logo debug:', { logolight, logodark, logolightData, logodarkData, logotext })

  // Get home URL - use site data if available, otherwise default to '/'
  const getHomeUrl = () => {
    // Try to get home URL from site data
    if (props.site?.url) {
      return props.site.url
    }
    
    // Fallback: construct home URL based on current language
    if (currentLanguage !== defaultlanguage) {
      return `/${currentLanguage}`
    }
    
    return '/'
  }

  const LogoComponent = () => {
    const hasLightLogo = logolightData?.url
    const hasDarkLogo = logodarkData?.url
    const hasAnyLogo = hasLightLogo || hasDarkLogo
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            {hasAnyLogo && (
              <div className="relative h-8 w-auto">
                {/* Light mode logo */}
                {hasLightLogo && (
                  <img 
                    src={logolightData.url} 
                    alt={logolightData.alt || logotext}
                    className="h-8 w-auto dark:hidden"
                  />
                )}
                {/* Dark mode logo */}
                {hasDarkLogo && (
                  <img 
                    src={logodarkData.url} 
                    alt={logodarkData.alt || logotext}
                    className="h-8 w-auto hidden dark:block"
                  />
                )}
                {/* Fallback: if only one logo is provided, show it in both modes */}
                {hasLightLogo && !hasDarkLogo && (
                  <img 
                    src={logolightData.url} 
                    alt={logolightData.alt || logotext}
                    className="h-8 w-auto hidden dark:block"
                  />
                )}
                {!hasLightLogo && hasDarkLogo && (
                  <img 
                    src={logodarkData.url} 
                    alt={logodarkData.alt || logotext}
                    className="h-8 w-auto dark:hidden"
                  />
                )}
              </div>
            )}
            {logotext && (
              <span className="text-xl font-bold">{logotext}</span>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{logotext}</h4>
            <p className="text-sm text-muted-foreground">
              Click to return to the homepage
            </p>
            {(hasLightLogo || hasDarkLogo) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Logo assets:</span>
                {hasLightLogo && <span>Light mode</span>}
                {hasLightLogo && hasDarkLogo && <span>•</span>}
                {hasDarkLogo && <span>Dark mode</span>}
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Collapsible 
            open={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen}
            className="md:hidden"
          >
            <CollapsibleTrigger asChild>
              <Button
                className="group size-8"
                variant="ghost"
                size="icon"
                aria-expanded={mobileMenuOpen}
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute top-16 left-0 right-0 z-50 bg-background border-b shadow-lg">
              <div className="container mx-auto p-4">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-2">
                    {shownavigation && sitepages.map((page: any, index: number) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={page.url || '#'}
                          className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <HomeIcon
                            size={16}
                            className="text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span>{page.title || `Page ${index + 1}`}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a 
              href={getHomeUrl()} 
              className="text-primary hover:text-primary/90 transition-colors"
              aria-label="Go to home page"
            >
              <LogoComponent />
            </a>
            {/* Desktop navigation - enhanced with Menubar */}
            {shownavigation && (
              <Menubar className="max-md:hidden border-none bg-transparent">
                {sitepages.map((page: any, index: number) => (
                  <MenubarMenu key={index}>
                    <MenubarTrigger 
                      className={`text-muted-foreground hover:text-primary font-medium cursor-pointer ${page.isActive ? 'text-primary' : ''}`}
                    >
                      <a
                        href={page.url || '#'}
                        className="flex items-center"
                      >
                        {page.title || `Page ${index + 1}`}
                      </a>
                    </MenubarTrigger>
                    {page.submenu && page.submenu.length > 0 && (
                      <MenubarContent>
                        {page.submenu.map((subpage: any, subIndex: number) => (
                          <MenubarItem key={subIndex}>
                            <a
                              href={subpage.url || '#'}
                              className="flex items-center w-full"
                            >
                              {subpage.title || `Subpage ${subIndex + 1}`}
                            </a>
                          </MenubarItem>
                        ))}
                      </MenubarContent>
                    )}
                  </MenubarMenu>
                ))}
              </Menubar>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <SiteSearch 
            sitepages={sitepages} 
            currentLanguage={currentLanguage}
            defaultLanguage={defaultlanguage}
          />
          {/* Theme toggle */}
          {(showthemetoggle === true || showthemetoggle === 'true') && (
            <ThemeToggle />
          )}
          {/* Language selector */}
          {(showlanguageselector === true || showlanguageselector === 'true') && languages.length > 0 && (
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger
                id={`language-${id}`}
                className="[&>svg]:text-muted-foreground/80 hover:bg-accent hover:text-accent-foreground h-8 border-none px-2 shadow-none [&>svg]:shrink-0"
                aria-label="Select language"
              >
                <GlobeIcon size={16} aria-hidden="true" />
                <SelectValue className="hidden sm:inline-flex" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                {languages.map((lang: any, index: number) => (
                  <SelectItem key={lang.value || index} value={lang.value || 'en'}>
                    <span className="flex items-center gap-2">
                      <span className="truncate">{lang.label || 'Language'}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </header>
  )
}

export default Comp582
