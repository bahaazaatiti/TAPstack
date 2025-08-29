import React, { useState } from "react"
import { cn } from "../lib/utils"
import LaunchUI from "./logos/launch-ui"
import ThemeToggle from "@/components/ui/theme-toggle"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { ArrowUp, Github, LogIn, ChevronDown } from "lucide-react"
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "./ui/footer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"


interface FooterSectionProps {
  [key: string]: any
}

const FooterSection: React.FC<FooterSectionProps> = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [collapsedColumns, setCollapsedColumns] = useState<{[key: number]: boolean}>({})
  
  const toggleColumn = (index: number) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  
  const {
    logo = <LaunchUI />,
    name = "Launch UI",
    columns = [],
    copyright = "© 2025 ta. All rights reserved",
    policies = [],
    showModeToggle = true,
    className = "",
  } = props

  // Handle logo data structure (single object or array)
  const logoData = Array.isArray(logo) ? logo[0] : logo

  const LogoComponent = () => {
    if (logoData && logoData.url) {
      return (
        <img
          src={logoData.url}
          alt={logoData.alt || name}
          className="h-8 w-auto"
        />
      )
    }
    // fallback to LaunchUI icon if no image

  }

  return (
    <footer className={cn("bg-background w-full px-4 fixed bottom-0 left-0 z-40", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            {/* Logo column - always visible */}
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <LogoComponent />
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
            </FooterColumn>
            
            {/* Mobile: Accordion for footer sections */}
            <div className="col-span-full md:hidden">
              {Array.isArray(columns) && columns.length > 0 && (
                <Accordion type="multiple" className="w-full">
                  {columns.map((column, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-md font-semibold">
                        {column.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {Array.isArray(column.links) && column.links.map((link: any, linkIndex: number) => (
                            <a
                              key={linkIndex}
                              href={link.href}
                              className="block text-muted-foreground text-sm hover:text-primary transition-colors"
                            >
                              {link.text}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
            
            {/* Desktop: Collapsible columns */}
            {Array.isArray(columns) && columns.map((column, index) => (
              <FooterColumn key={index} className="hidden md:block">
                <Collapsible 
                  open={collapsedColumns[index] !== false} 
                  onOpenChange={() => toggleColumn(index)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {Array.isArray(column.links) && column.links.map((link: any, linkIndex: number) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        className="block text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        {link.text}
                      </a>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="text-start hover:text-primary transition-colors cursor-pointer">
                  {copyright}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Quick Actions</DialogTitle>
                  <DialogDescription>
                    Choose an action below
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-auto py-4 px-6 flex items-center justify-start gap-4"
                    onClick={() => {
                      window.open('https://github.com/bahaazaatiti/TAPstack', '_blank')
                      setIsDialogOpen(false)
                    }}
                  >
                    <Github className="size-6 shrink-0" />
                    <div className="flex flex-col items-start text-start">
                      <span className="font-medium text-base">GitHub</span>
                      <span className="text-sm text-muted-foreground">Report bugs here!</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full h-auto py-4 px-6 flex items-center justify-start gap-4"
                    onClick={() => {
                      window.location.href = '/panel'
                      setIsDialogOpen(false)
                    }}
                  >
                    <LogIn className="size-6 shrink-0" />
                    <div className="flex flex-col items-start text-start">
                      <span className="font-medium text-base">Login</span>
                      <span className="text-sm opacity-75">Access admin panel</span>
                    </div>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-4">
              {Array.isArray(policies) && policies.map((policy: any, index: number) => (
                <a key={index} href={policy.href}>
                  {policy.text}
                </a>
              ))}
              {/* Separator and action buttons 
              //TODO: seperator not working*/}
              <Separator orientation="vertical" className="h-6 mx-2 w-px bg-gray-300" />
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ArrowUp className="size-4" />
                Back to top
              </Button>
              {(showModeToggle === true || showModeToggle === 'true') && <ThemeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  )
}

export default FooterSection
