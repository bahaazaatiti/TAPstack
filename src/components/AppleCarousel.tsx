import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AppleCarouselProps {
  title?: string;
  articles?: Article[];
  initialScroll?: number;
  [key: string]: any;
}

interface Article {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: number;
  url: string;
  author: string;
  content: string;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
}

const AppleCarousel: React.FC<AppleCarouselProps> = (props) => {
  const {
    title = "Featured Stories",
    articles: articleData = [],
    initialScroll = 0
  } = props;

  // Use articles from props if available, otherwise fall back to mock data
  const articles: Article[] = articleData.length > 0 ? articleData : [
    {
      title: "The Future of Web Development",
      description: "Exploring modern frameworks and technologies shaping the web development landscape.",
      category: "Technology",
      date: "Nov 20, 2024",
      readTime: 8,
      url: "/blog/future-web-dev",
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
        alt: "Web development workspace",
        width: 800,
        height: 600
      }
    },
    {
      title: "Design Systems That Scale",
      description: "Building consistent and scalable design systems for modern applications.",
      category: "Design", 
      date: "Nov 15, 2024",
      readTime: 6,
      url: "/blog/design-systems",
      author: "Jane Smith",
      content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800",
        alt: "Design system components",
        width: 800,
        height: 600
      }
    }
  ];

  // Filter out articles without featured images
  const articlesWithImages = articles.filter(article => article.featuredImage);

  // Convert articles to card format
  const cards = articlesWithImages.map((article) => ({
    src: article.featuredImage?.url || "",
    title: article.title,
    category: article.category,
    content: (
      <UICard className="overflow-hidden border">
        <CardContent className="p-0">
          {/* Featured Image - Full Size */}
          {article.featuredImage && (
            <div className="w-full">
              <img
                src={article.featuredImage.url}
                alt={article.featuredImage.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </CardContent>
      </UICard>
    ),
  }));

  if (cards.length === 0) {
    return (
      <div className="w-full py-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {title}
        </h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No articles with featured images found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="px-6 xl:px-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8 max-w-xl">
          {title}
        </h2>
      </div>
      <Carousel items={cards.map((card, index) => (
        <Card key={index} card={card} index={index} />
      ))} initialScroll={initialScroll} />
    </div>
  );
};

export default AppleCarousel;
