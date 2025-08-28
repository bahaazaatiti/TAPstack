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
  cards?: Array<{
    title: string;
    image?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    } | null;
    features: Array<{
      icon: string;
      text: string;
    }>;
    buttontext: string;
    buttonurl: string;
    buttonexternal: boolean;
  }>;
  [key: string]: any;
}

const Features03: React.FC<Features03Props> = (props) => {
  const {
    title = "Design and Engage:",
    subtitle = "Build Smarter Spaces and Strategies",
    cards = [
      {
        title: "Plan Smarter",
        image: null,
        features: [
          {
            icon: "settings2",
            text: "Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds."
          },
          {
            icon: "blocks", 
            text: "Embed polls, quizzes, or forms to keep your audience engaged."
          }
        ],
        buttontext: "Build your strategy",
        buttonurl: "#",
        buttonexternal: false
      },
      {
        title: "Engage Better",
        image: null,
        features: [
          {
            icon: "star",
            text: "Track engagement with real-time analytics and insights."
          },
          {
            icon: "heart",
            text: "Build stronger connections with your audience through interactive content."
          }
        ],
        buttontext: "Start engaging", 
        buttonurl: "#",
        buttonexternal: false
      }
    ]
  } = props;

  // Debug logging to check if images are being passed correctly
  console.log('Features03 props:', props);
  console.log('Cards data:', cards);

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
        
        {/* Dynamic Cards */}
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6">
          {cards.map((card, cardIndex) => {
            const isEven = cardIndex % 2 === 0;
            
            if (isEven) {
              // Even cards (0, 2, 4...) - Content first, then image on desktop
              return (
                <React.Fragment key={cardIndex}>
                  {/* Content Card */}
                  <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
                    {/* Mobile Image */}
                    <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl overflow-hidden">
                      {card.image?.url ? (
                        <img
                          src={card.image.url}
                          alt={card.image.alt || card.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    <span className="text-2xl font-semibold tracking-tight">
                      {card.title}
                    </span>

                    <ul className="mt-6 space-y-4">
                      {card.features.map((feature, index) => (
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
                      onClick={() => handleButtonClick(card.buttonurl, card.buttonexternal)}
                    >
                      {card.buttontext} <ArrowRight />
                    </Button>
                  </div>
                  
                  {/* Image Card - Desktop */}
                  <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden">
                    {card.image?.url ? (
                      <img
                        src={card.image.url}
                        alt={card.image.alt || card.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            } else {
              // Odd cards (1, 3, 5...) - Image first, then content on desktop
              return (
                <React.Fragment key={cardIndex}>
                  {/* Image Card - Desktop */}
                  <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden">
                    {card.image?.url ? (
                      <img
                        src={card.image.url}
                        alt={card.image.alt || card.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Content Card */}
                  <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
                    {/* Mobile Image */}
                    <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl overflow-hidden">
                      {card.image?.url ? (
                        <img
                          src={card.image.url}
                          alt={card.image.alt || card.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    <span className="text-2xl font-semibold tracking-tight">
                      {card.title}
                    </span>

                    <ul className="mt-6 space-y-4">
                      {card.features.map((feature, index) => (
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
                      onClick={() => handleButtonClick(card.buttonurl, card.buttonexternal)}
                    >
                      {card.buttontext} <ArrowRight />
                    </Button>
                  </div>
                </React.Fragment>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Features03;
