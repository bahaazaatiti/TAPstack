import React, { useState } from "react"
import { cn } from "../lib/utils"
import ThemeToggle from "@/components/ui/theme-toggle"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { ArrowUp, Github, LogIn } from "lucide-react"
import Socials from "@/components/ui/socials"
import {
  Footer,
  FooterBottom,
} from "./ui/footer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"


interface FooterSectionProps {
  [key: string]: any
}

const FooterSection: React.FC<FooterSectionProps> = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const {
    copyright = "© 2025. All rights reserved",
    socials = [],
    showModeToggle = true,
    className = "",
    translations = {},
  } = props

  return (
    <footer className={cn("bg-background w-full px-4 fixed bottom-0 left-0 z-40", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterBottom>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="text-start hover:text-primary transition-colors cursor-pointer">
                  {copyright}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{translations.quick_actions || "Quick Actions"}</DialogTitle>
                  <DialogDescription>
                    {translations.choose_action || "Choose an action below"}
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
                      <span className="font-medium text-base">{translations.github || "GitHub"}</span>
                      <span className="text-sm text-muted-foreground">{translations.report_bugs || "Report bugs here!"}</span>
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
                      <span className="font-medium text-base">{translations.login || "Login"}</span>
                      <span className="text-sm opacity-75">{translations.access_panel || "Access admin panel"}</span>
                    </div>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
        {/* Socials + Action buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Socials: normal flow on mobile, absolutely centered on md+ */}
              <div className="flex items-center md:absolute md:left-1/2 md:-translate-x-1/2">
                <Socials socials={socials} />
              </div>

              {/* Separator - only show on desktop */}
              <Separator orientation="vertical" className="h-6 mx-2 w-px bg-gray-300 hidden md:block" />

              {/* Action buttons */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ArrowUp className="size-4" />
                {translations.back_to_top || "Back to top"}
              </Button>
              {(showModeToggle === true || showModeToggle === 'true') && <ThemeToggle translations={translations} />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  )
}

export default FooterSection
