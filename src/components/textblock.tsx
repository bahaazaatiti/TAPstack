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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  Copy,
  Share2
} from "lucide-react"
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
    description = ''
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);

  // Enhanced content processing
  const processContent = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    const sentences = text.split('.').filter(s => s.trim());
    
    return {
      paragraphs,
      firstParagraph: paragraphs[0] || text,
      hasMoreParagraphs: paragraphs.length > 1,
      isLongContent: text.length > 300,
      sentences,
      summary: sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '...' : ''),
      wordCount: text.split(/\s+/).length
    };
  };

  const { 
    paragraphs, 
    hasMoreParagraphs, 
    isLongContent, 
    summary,
    wordCount 
  } = processContent(description);

  // Actions
  const copyContent = () => {
    navigator.clipboard.writeText(description).then(() => {
      toast.success('Content copied to clipboard');
    });
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: summary,
        url: window.location.href,
      }).catch(console.error);
    } else {
      copyContent();
    }
  };

  return (
    <section>
      <div className="py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto max-w-screen-xl">
            {/* Enhanced Layout with Resizable Panels */}
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[400px] rounded-lg border"
            >
              {/* Main Content Panel */}
              <ResizablePanel defaultSize={75} minSize={50}>
                <Card className={`border-none shadow-none h-full ${isMaximized ? 'fixed inset-4 z-50 max-w-none' : ''}`}>
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Header with Controls */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        {icon && icon.url && (
                          <img
                            src={icon.url}
                            alt={icon.alt}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          {subtitle && (
                            <Badge variant="secondary" className="mb-2">
                              {subtitle}
                            </Badge>
                          )}
                          <h2 className="text-foreground text-4xl font-semibold">{title}</h2>
                        </div>
                      </div>
                      
                      {/* Control Actions */}
                      <div className="flex items-center gap-2">
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

                    {/* Enhanced Content Area with ScrollArea */}
                    <div className="flex-1">
                      <ScrollArea className={`${isLongContent ? 'h-64' : 'h-auto'} pr-4`}>
                        <div className="text-muted-foreground text-xl space-y-4">
                          {/* Main Content with Enhanced Collapsible */}
                          <Collapsible
                            open={isExpanded}
                            onOpenChange={setIsExpanded}
                          >
                            <div className="space-y-4">
                              <p className="leading-relaxed">
                                {isExpanded ? paragraphs[0] : summary}
                              </p>
                              
                              <CollapsibleContent className="space-y-4">
                                {paragraphs.slice(1).map((paragraph, index) => (
                                  <p key={index} className="leading-relaxed">
                                    {paragraph}
                                  </p>
                                ))}
                                
                                {/* Additional Enhanced Content */}
                                {showAdditionalContent && (
                                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                                    <h4 className="font-semibold text-foreground mb-2">Additional Information</h4>
                                    <p className="text-sm leading-relaxed">
                                      This content contains approximately {wordCount} words and provides 
                                      comprehensive information about the topic. The expandable design 
                                      allows for better content organization and improved readability.
                                    </p>
                                  </div>
                                )}
                              </CollapsibleContent>
                            </div>
                            
                            {(hasMoreParagraphs || isLongContent) && (
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="mt-4 text-primary hover:text-primary/80 w-full sm:w-auto"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="mr-2 h-4 w-4" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="mr-2 h-4 w-4" />
                                      Read More ({wordCount} words)
                                    </>
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            )}
                          </Collapsible>

                          {/* Additional Content Toggle */}
                          {isExpanded && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAdditionalContent(!showAdditionalContent)}
                              className="mt-4 text-sm"
                            >
                              {showAdditionalContent ? 'Hide Details' : 'Show Additional Details'}
                            </Button>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Content Stats */}
                    <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Content: {wordCount} words</span>
                        <span>Reading time: ~{Math.ceil(wordCount / 200)} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ResizablePanel>

              <ResizableHandle />

              {/* Side Panel for Additional Tools */}
              <ResizablePanel defaultSize={25} minSize={20}>
                <div className="h-full p-6 bg-muted/20">
                  <h3 className="font-semibold mb-4 text-foreground">Content Tools</h3>
                  
                  <div className="space-y-4">
                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" onClick={copyContent} className="justify-start">
                          <Copy className="mr-2 h-3 w-3" />
                          Copy Text
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareContent} className="justify-start">
                          <Share2 className="mr-2 h-3 w-3" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Content Summary */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Summary</h4>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Paragraphs:</span>
                          <span>{paragraphs.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Words:</span>
                          <span>{wordCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Characters:</span>
                          <span>{description.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Navigation */}
                    {paragraphs.length > 1 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Navigation</h4>
                        <ScrollArea className="h-32">
                          <div className="space-y-1">
                            {paragraphs.map((_, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => setIsExpanded(true)}
                              >
                                Section {index + 1}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TextBlock