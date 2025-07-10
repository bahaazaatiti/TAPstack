import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface Navbar04Props {
  [key: string]: any
}

const Navbar04: React.FC<Navbar04Props> = (props) => {
  const {
    logo = null,
    logotext = 'Logo', // Note: Kirby converts camelCase to lowercase
    navigationitems = [], // Note: Kirby converts camelCase to lowercase
    signintext = 'Sign In',
    signinurl = '#',
    signinexternal = false,
    getstartedtext = 'Get Started',
    getstartedurl = '#',
    getstartedexternal = false,
    showsignin = true,
    showgetstarted = true
  } = props

  // Debug logging
  console.log('Navbar04 props:', props)

  const [isSheetOpen, setIsSheetOpen] = useState(false)

    const LogoComponent = () => {
    // Handle logo data structure (single object or array)
    const logoData = Array.isArray(logo) ? logo[0] : logo;
    
    return (
        <div className="flex items-center gap-2">
        {logoData?.url && (
            <img 
            src={logoData.url} 
            alt={logoData.alt || logotext}
            className="h-8 w-auto"
            />
        )}
        <span className="text-xl font-bold">{logotext}</span>
        </div>
    );
    }

  const NavMenu = ({ className = '', orientation = 'horizontal' }: { className?: string, orientation?: 'horizontal' | 'vertical' }) => (
    <NavigationMenu className={className}>
      <NavigationMenuList className={`gap-6 space-x-0 ${orientation === 'vertical' ? 'flex-col items-start' : ''}`}>
        {navigationitems.map((item: any, index: number) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink asChild>
              <a 
                href={item.url || '#'}
                target={item.external === 'true' || item.external === true ? '_blank' : '_self'}
                rel={item.external === 'true' || item.external === true ? 'noopener noreferrer' : undefined}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                {item.title || `Item ${index + 1}`}
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )

  const NavigationSheet = () => (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
    <SheetContent>
    <SheetHeader>
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation menu with links and action buttons
        </SheetDescription>
    </SheetHeader>
    <LogoComponent />
    <NavMenu orientation="vertical" className="mt-12" />
        <div className="mt-8 space-y-4">
          {(showsignin === true || showsignin === 'true') && (
            <Button
              variant="outline"
              className="w-full rounded-full"
              asChild
            >
              <a
                href={signinurl}
                target={signinexternal === 'true' || signinexternal === true ? '_blank' : '_self'}
                rel={signinexternal === 'true' || signinexternal === true ? 'noopener noreferrer' : undefined}
              >
                {signintext}
              </a>
            </Button>
          )}
          {(showgetstarted === true || showgetstarted === 'true') && (
            <Button className="w-full rounded-full" asChild>
              <a
                href={getstartedurl}
                target={getstartedexternal === 'true' || getstartedexternal === true ? '_blank' : '_self'}
                rel={getstartedexternal === 'true' || getstartedexternal === true ? 'noopener noreferrer' : undefined}
              >
                {getstartedtext}
              </a>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full z-50">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <LogoComponent />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          {(showsignin === true || showsignin === 'true') && (
            <Button
              variant="outline"
              className="hidden sm:inline-flex rounded-full"
              asChild
            >
              <a
                href={signinurl}
                target={signinexternal === 'true' || signinexternal === true ? '_blank' : '_self'}
                rel={signinexternal === 'true' || signinexternal === true ? 'noopener noreferrer' : undefined}
              >
                {signintext}
              </a>
            </Button>
          )}
          {(showgetstarted === true || showgetstarted === 'true') && (
            <Button className="rounded-full" asChild>
              <a
                href={getstartedurl}
                target={getstartedexternal === 'true' || getstartedexternal === true ? '_blank' : '_self'}
                rel={getstartedexternal === 'true' || getstartedexternal === true ? 'noopener noreferrer' : undefined}
              >
                {getstartedtext}
              </a>
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar04