import React from 'react'
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Blocks, 
  Settings2, 
  Home, 
  User, 
  Star, 
  Heart, 
  Check, 
  Plus, 
  Minus 
} from "lucide-react"

interface Features03Props {
  title?: string;
  subtitle?: string;
  card1title?: string;
  card1features?: Array<{
    icon: string;
    text: string;
  }>;
  card1buttontext?: string;
  card1buttonurl?: string;
  card1buttonexternal?: boolean;
  card2title?: string;
  card2features?: Array<{
    icon: string;
    text: string;
  }>;
  card2buttontext?: string;
  card2buttonurl?: string;
  card2buttonexternal?: boolean;
  [key: string]: any;
}

const Features03: React.FC<Features03Props> = (props) => {
  const {
    title = "Design and Engage:",
    subtitle = "Build Smarter Spaces and Strategies",
    card1title = "Plan Smarter",
    card1features = [
      {
        icon: "settings2",
        text: "Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds."
      },
      {
        icon: "blocks", 
        text: "Embed polls, quizzes, or forms to keep your audience engaged."
      }
    ],
    card1buttontext = "Build your strategy",
    card1buttonurl = "#",
    card1buttonexternal = false,
    card2title = "Engage Better",
    card2features = [
      {
        icon: "star",
        text: "Track engagement with real-time analytics and insights."
      },
      {
        icon: "heart",
        text: "Build stronger connections with your audience through interactive content."
      }
    ],
    card2buttontext = "Start engaging", 
    card2buttonurl = "#",
    card2buttonexternal = false
  } = props;

  // Icon mapping
  const iconMap = {
    arrowright: ArrowRight,
    blocks: Blocks,
    settings2: Settings2,
    home: Home,
    user: User,
    star: Star,
    heart: Heart,
    check: Check,
    plus: Plus,
    minus: Minus
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Settings2;
    return <IconComponent className="shrink-0" />;
  };

  const handleButtonClick = (url: string, external: boolean) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-screen-lg mx-auto py-12 px-6">
        <h2 className="text-3xl leading-10 sm:text-4xl md:text-[40px] md:leading-[3.25rem] font-bold tracking-tight">
          {title} <br />
          {subtitle}
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 1 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl"></div>

            <span className="text-2xl font-semibold tracking-tight">
              {card1title}
            </span>

            <ul className="mt-6 space-y-4">
              {card1features.map((feature, index) => (
                <li key={index}>
                  <div className="flex items-start gap-3">
                    {getIcon(feature.icon)}
                    <p className="-mt-0.5">
                      {feature.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Button 
              className="mt-12 w-full"
              onClick={() => handleButtonClick(card1buttonurl, card1buttonexternal)}
            >
              {card1buttontext} <ArrowRight />
            </Button>
          </div>
          
          {/* Media 1 Desktop */}
          <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2"></div>

          {/* Media 2 Desktop */}
          <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2"></div>
          
          {/* Card 2 */}
          <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 2 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl"></div>

            <span className="text-2xl font-semibold tracking-tight">
              {card2title}
            </span>

            <ul className="mt-6 space-y-4">
              {card2features.map((feature, index) => (
                <li key={index}>
                  <div className="flex items-start gap-3">
                    {getIcon(feature.icon)}
                    <p className="-mt-0.5">
                      {feature.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Button 
              className="mt-12 w-full"
              onClick={() => handleButtonClick(card2buttonurl, card2buttonexternal)}
            >
              {card2buttontext} <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features03;
