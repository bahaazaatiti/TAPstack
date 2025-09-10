import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Minus,
  ChevronDown 
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
      title: string;
      icon: string;
      text: string;
    }>;
    buttontext: string;
    buttonurl: string;
    buttonexternal: boolean;
  }>;
  showfaq?: boolean;
  faqtitle?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  [key: string]: any;
}

const Features03: React.FC<Features03Props> = (props) => {
  const {
    title = "Design and Engage:",
    subtitle = "Build Smarter Spaces and Strategies",
    showfaq = true,
    faqtitle = "Frequently Asked Questions",
    faqs = [],
    cards = [
      {
        title: "Plan Smarter",
        image: null,
        features: [
          {
            title: "Drag & Drop Design",
            icon: "settings2",
            text: "Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds."
          },
          {
            title: "Interactive Elements",
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
            title: "Real-time Analytics",
            icon: "star",
            text: "Track engagement with real-time analytics and insights."
          },
          {
            title: "Audience Connection",
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

  // Enhanced state for collapsible features
  const [openFeatures, setOpenFeatures] = React.useState<Record<string, boolean>>({})

  // Toggle feature expansion
  const toggleFeature = (cardIndex: number, featureIndex: number) => {
    const key = `${cardIndex}-${featureIndex}`
    setOpenFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-screen-lg mx-auto py-12 px-6">
        <h2 className="text-3xl leading-10 sm:text-4xl md:text-[40px] md:leading-[3.25rem] font-bold tracking-tight">
          {title} <br />
          {subtitle}
        </h2>
        
        {/* Enhanced Dynamic Cards with FAQ Section */}
        <div className="mt-8 space-y-12">
          {/* Main Feature Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6">
          {cards.map((card, cardIndex) => {
            const isEven = cardIndex % 2 === 0;
            
            if (isEven) {
              // Even cards (0, 2, 4...) - Content first, then image on desktop
              return (
                <React.Fragment key={cardIndex}>
                  {/* Content Card */}
                  <Card className="pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
                    <CardContent className="p-0">
                      {/* Mobile Image */}
                      <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl overflow-hidden">
                        {card.image?.url ? (
                          <img
                            src={card.image.url}
                            alt={card.image.alt || card.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Alert>
                            <AlertDescription className="text-center">
                              No Image
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <span className="text-2xl font-semibold tracking-tight">
                        {card.title}
                      </span>

                      {/* Enhanced Features with Collapsible Details */}
                      <ScrollArea className="mt-6 max-h-96">
                        <ul className="space-y-4">
                          {card.features.map((feature, index) => (
                            <li key={index}>
                              <Collapsible
                                open={openFeatures[`${cardIndex}-${index}`]}
                                onOpenChange={() => toggleFeature(cardIndex, index)}
                              >
                                <CollapsibleTrigger className="flex items-center justify-between w-full text-start p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                  <div className="flex items-start gap-3 flex-1">
                                    {getIcon(feature.icon)}
                                    <p className="-mt-0.5 font-medium">
                                      {feature.title}
                                    </p>
                                  </div>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${openFeatures[`${cardIndex}-${index}`] ? 'rotate-180' : ''}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ps-9 pt-2">
                                  <div className="text-sm text-muted-foreground space-y-2">
                                    {(() => {
                                      const parts = feature.text.split(/[-•]\s+/);
                                      if (parts.length > 1) {
                                        return parts.slice(1).map((part, idx) => (
                                          <p key={idx} className="leading-relaxed">
                                            • {part.trim()}
                                          </p>
                                        ));
                                      } else if (parts[0] && parts[0].trim()) {
                                        return <p className="leading-relaxed">{parts[0].trim()}</p>;
                                      }
                                      return <p className="leading-relaxed">Learn more about this feature and how it can benefit your workflow.</p>;
                                    })()}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>

                      <Button 
                        className="mt-12 w-full"
                        onClick={() => handleButtonClick(card.buttonurl, card.buttonexternal)}
                      >
                        {card.buttontext} <ArrowRight />
                      </Button>
                    </CardContent>
                  </Card>
                  
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
                      <Alert className="m-4">
                        <AlertDescription className="text-center">
                          No Image
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  {/* Content Card */}
                  <Card className="pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
                    <CardContent className="p-0">
                    {/* Mobile Image */}
                    <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl overflow-hidden">
                      {card.image?.url ? (
                        <img
                          src={card.image.url}
                          alt={card.image.alt || card.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Alert className="m-4">
                          <AlertDescription className="text-center">
                            No Image
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <span className="text-2xl font-semibold tracking-tight">
                      {card.title}
                    </span>

                    {/* Enhanced Features with Collapsible Details */}
                    <ScrollArea className="mt-6 max-h-64">
                      <ul className="space-y-4">
                        {card.features.map((feature, index) => (
                          <li key={index}>
                            <Collapsible
                              open={openFeatures[`${cardIndex}-${index}`]}
                              onOpenChange={() => toggleFeature(cardIndex, index)}
                            >
                              <CollapsibleTrigger className="flex items-center justify-between w-full text-start p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-3 flex-1">
                                  {getIcon(feature.icon)}
                                  <p className="-mt-0.5 font-medium">
                                    {feature.title}
                                  </p>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openFeatures[`${cardIndex}-${index}`] ? 'rotate-180' : ''}`} />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="ps-9 pt-2">
                                <div className="text-sm text-muted-foreground space-y-2">
                                  {(() => {
                                    const parts = feature.text.split(/[-•]\s+/);
                                    if (parts.length > 1) {
                                      return parts.slice(1).map((part, idx) => (
                                        <p key={idx} className="leading-relaxed">
                                          • {part.trim()}
                                        </p>
                                      ));
                                    } else if (parts[0] && parts[0].trim()) {
                                      return <p className="leading-relaxed">{parts[0].trim()}</p>;
                                    }
                                    return <p className="leading-relaxed">Learn more about this feature and how it can benefit your workflow.</p>;
                                  })()}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>

                    <Button 
                      className="mt-12 w-full"
                      onClick={() => handleButtonClick(card.buttonurl, card.buttonexternal)}
                    >
                      {card.buttontext} <ArrowRight />
                    </Button>
                    </CardContent>
                  </Card>
                </React.Fragment>
              );
            }
          })}
          </div>

          {/* Dynamic FAQ/Information Accordion Section */}
          {showfaq && faqs.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold tracking-tight mb-6">{faqtitle}</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Features03;
