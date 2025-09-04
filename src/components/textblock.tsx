import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  Copy,
  Share2
} from "lucide-react"
// TODO: toast broken here
import { toast } from "sonner"

interface TextBlockProps {
  icon?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
  subtitle?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

const TextBlock: React.FC<TextBlockProps> = (props) => {
  const {
    icon = null,
    subtitle = '',
    title = '',
    description = '',
    translations = {}
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Process content into paragraphs
  const paragraphs = description.split('\n\n').filter(p => p.trim());
  const hasMoreParagraphs = paragraphs.length > 1;

  // Auto-expand when maximized, auto-collapse when minimized
  React.useEffect(() => {
    setIsExpanded(isMaximized);
  }, [isMaximized]);

  // Actions
  const copyContent = () => {
    navigator.clipboard.writeText(description).then(() => {
      toast.success(translations.content_copied || 'Content copied to clipboard');
    });
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      copyContent();
    }
  };

  return (
    <section>
      <div className="py-10">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto max-w-screen-xl">
            {/* Main Content */}
            <Card className={`${isMaximized ? 'fixed inset-4 z-50 max-w-none' : ''}`}>
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header with Controls */}
                <div className="flex-col items-start justify-between mb-6">
                  {/* Control Actions */}
                  <div className="flex items-center gap-2 mb-4 w-full justify-between">
                    <div>
                      {subtitle && (
                        <Badge variant="secondary" className="mb-2">
                          {subtitle}
                        </Badge>
                      )}
                    </div>
                    <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyContent}
                      className="opacity-60 hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareContent}
                      className="opacity-60 hover:opacity-100"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="opacity-60 hover:opacity-100"
                    >
                      {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {icon && icon.url && (
                      <img
                        src={icon.url}
                        alt={icon.alt}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h2 className="text-foreground text-4xl font-semibold">{title}</h2>
                    </div>
                  </div>
                  

                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0">
                  <ScrollArea className={`ps-4 ${isMaximized ? 'h-[calc(100vh-16rem)]' : 'h-auto'}`}>
                    <div className="text-muted-foreground text-xl leading-relaxed">
                      <Collapsible
                        open={isExpanded}
                        onOpenChange={setIsExpanded}
                      >
                        {/* Always show first paragraph */}
                        <p className="mb-4">
                          {paragraphs[0] || description}
                        </p>
                        
                        {/* Additional paragraphs in collapsible content */}
                        {hasMoreParagraphs && (
                          <CollapsibleContent>
                            {paragraphs.slice(1).map((paragraph, index) => (
                              <p key={index + 1} className="mb-4 last:mb-0">
                                {paragraph}
                              </p>
                            ))}
                          </CollapsibleContent>
                        )}
                        
                        {/* Read More / Show Less button */}
                        {hasMoreParagraphs && (
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 text-primary hover:text-primary/80"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="mr-2 h-4 w-4" />
                                  {translations.show_less || "Show Less"}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                  {translations.read_more || "Read More"}
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </Collapsible>
                    </div>
                  </ScrollArea>
                </div>

                {/* Content Stats */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TextBlock