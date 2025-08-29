import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

  // Get first paragraph and check if there's more content
  const getFirstParagraph = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return {
      firstParagraph: paragraphs[0] || text,
      hasMore: paragraphs.length > 1
    };
  };

  const { firstParagraph, hasMore } = getFirstParagraph(description);

  return (
    <section>
      <div className="py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto max-w-screen-xl">
            <Card className="border-none shadow-none">
              <CardContent className="p-0">
                {icon && icon.url && (
                  <img
                    src={icon.url}
                    alt={icon.alt}
                    className="w-12 h-12 object-cover mb-4"
                  />
                )}
                {subtitle && (
                  <Badge variant="secondary" className="mb-4">
                    {subtitle}
                  </Badge>
                )}
                <h2 className="text-foreground mt-4 text-4xl font-semibold">{title}</h2>
                <div className="text-muted-foreground mt-4 text-xl"> 
                  <p className="mb-4">
                    {isExpanded ? description : firstParagraph}
                  </p>
                  {hasMore && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className=" text-primary hover:text-primary/80"
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TextBlock