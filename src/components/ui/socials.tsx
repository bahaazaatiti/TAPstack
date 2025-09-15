import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Music,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SocialLink {
  platform: 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  href: string
  label?: string
}

interface SocialsProps {
  socials?: SocialLink[]
  className?: string
}

const iconMap = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music, // Using Music icon for TikTok since there's no specific TikTok icon in Lucide
  youtube: Youtube,
}

const defaultLabels = {
  twitter: "Follow on Twitter/X",
  facebook: "Follow on Facebook", 
  instagram: "Follow on Instagram",
  tiktok: "Follow on TikTok",
  youtube: "Subscribe on YouTube",
}

export default function Socials({ socials = [], className = "" }: SocialsProps) {
  if (!socials.length) return null

  return (
    <div className={`inline-flex flex-wrap gap-1 sm:gap-2 ${className}`}>
      {socials.map((social, index) => {
        const Icon = iconMap[social.platform]
        const label = social.label || defaultLabels[social.platform]
        
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button 
                className="size-8"
                variant="outline" 
                aria-label={label} 
                size="icon"
                asChild
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <Icon size={16} aria-hidden="true" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
