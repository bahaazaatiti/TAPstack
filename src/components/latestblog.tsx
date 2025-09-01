import React from "react";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  ExternalLink, 
  Copy, 
  Share2, 
  Bookmark, 
  Clock,
  User
} from "lucide-react";
import { toast } from "sonner";

interface LatestBlogProps {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  articles?: Article[];
  [key: string]: any;
}

interface Article {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: number;
  url: string;
  author?: string; // Make author optional
  authorImage?: {
    url: string;
    alt: string;
  } | null;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
}

const LatestBlog: React.FC<LatestBlogProps> = (props) => {
  // Debug: Log the props to see what data we're getting
  console.log('LatestBlog props:', props);
  
  // Helper function to safely extract string values
  const safeString = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.value) return String(value.value);
    if (typeof value === 'object' && value.toString) return value.toString();
    return String(value);
  };
  
  const {
    title = "Latest articles",
    buttonText = "View all articles", 
    buttonUrl = "/",
    articles: articleData = [],
  } = props;

  // Use articles from props if available, otherwise fall back to mock data
  const processedArticles: Article[] = articleData.length > 0 ? articleData.map((article: any) => ({
    title: safeString(article.title) || 'Untitled',
    description: safeString(article.description) || 'No description available',
    category: safeString(article.category) || '',
    date: safeString(article.date) || '',
    readTime: typeof article.readTime === 'number' ? article.readTime : (parseInt(safeString(article.readTime)) || 5),
    url: safeString(article.url) || '#',
    author: safeString(article.author) || undefined,
    authorImage: article.authorImage || null,
    featuredImage: article.featuredImage || null
  })) : [
    {
      title: "A beginner's guide to blockchain for engineers",
      description: "Our goal is to streamline SMB trade, making it easier and faster than ever.",
      category: "Technology",
      date: "Nov 20, 2024",
      readTime: 5,
      url: "/blog/blockchain-guide",
      author: "John Doe",
      featuredImage: null
    },
    {
      title: "Top business trends for 2025",
      description: "Discover the key business trends that will shape 2025 and how companies can prepare.",
      category: "Business",
      date: "Nov 15, 2024",
      readTime: 3,
      url: "/blog/business-trends",
      author: "Jane Smith",
      featuredImage: null
    },
    {
      title: "Essential health tips for remote workers",
      description: "Learn essential health tips to maintain your wellbeing while working from home.",
      category: "Health",
      date: "Nov 10, 2024",
      readTime: 4,
      url: "/blog/health-tips",
      author: "Dr. Sarah Johnson",
      featuredImage: null
    },
    {
      title: "Future of artificial intelligence",
      description: "Exploring the latest developments in AI and their impact on various industries.",
      category: "Technology",
      date: "Nov 5, 2024",
      readTime: 6,
      url: "/blog/ai-future",
      author: "Alex Chen",
      featuredImage: null
    }
  ];

  // Show only the latest 8 articles
  const latestArticles = processedArticles.slice(0, 8);

  // Context menu actions
  const copyArticleLink = (url: string, title: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success(`Link copied: ${title}`);
    });
  };

  const shareArticle = (url: string, title: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        url: fullUrl,
      }).catch(console.error);
    } else {
      copyArticleLink(url, title);
    }
  };

  const bookmarkArticle = (title: string) => {
    toast.success(`Bookmarked: ${title}`);
  };

  const openInNewTab = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full py-10 lg:py-16 px-6 xl:px-10">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            {title}
          </h4>
          <Button className="gap-4" asChild>
            <a href={buttonUrl}>
              {buttonText} <MoveRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestArticles.map((article, index) => {
            // Add defensive checks for article data
            if (!article || typeof article !== 'object') {
              console.warn('Invalid article data at index', index, article);
              return null;
            }

            return (
              <ContextMenu key={index}>
                <ContextMenuTrigger asChild>
                  <div>
                    {/* Desktop: Regular link with HoverCard */}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <a
                          href={article.url || '#'}
                          className="hidden md:block hover:opacity-75 cursor-pointer"
                        >
                          <Card className="border-none shadow-none hover:shadow-md transition-shadow h-full">
                            <CardHeader className="p-0">
                              <div className="bg-muted rounded-md aspect-video mb-4 overflow-hidden">
                                {article.featuredImage ? (
                                  <img
                                    src={article.featuredImage.url}
                                    alt={article.featuredImage.alt || article.title || 'Article image'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 p-6 pt-0">
                              <h3 className="text-xl tracking-tight">{article.title || 'Untitled'}</h3>
                              <p className="text-muted-foreground text-base">
                                {article.description || 'No description available'}
                              </p>
                              <div className="text-sm text-muted-foreground">
                                {article.author && (
                                  <div className="flex items-center gap-2">
                                    <span>By</span>
                                    {article.authorImage?.url ? (
                                      <Avatar className="h-4 w-4">
                                        <AvatarImage 
                                          src={article.authorImage.url} 
                                          alt={article.authorImage.alt || article.author}
                                        />
                                        <AvatarFallback>
                                          {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <Skeleton className="h-4 w-4 rounded-full" />
                                    )}
                                    <span>{article.author}</span>
                                    {article.date && <span> • {article.date}</span>}
                                  </div>
                                )}
                                {!article.author && article.date && <span>{article.date}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold leading-none">{article.title || 'Untitled'}</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              {article.description || 'No description available'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center gap-2">
                              {article.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {article.category}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{article.readTime} min read</span>
                              </div>
                            </div>
                          </div>
                          {article.author && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{article.author}</span>
                              {article.date && (
                                <>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <span className="text-sm text-muted-foreground">{article.date}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    {/* Mobile: Drawer */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <div className="md:hidden cursor-pointer hover:opacity-75">
                          <Card className="border-none shadow-none hover:shadow-md transition-shadow h-full">
                            <CardHeader className="p-0">
                              <div className="bg-muted rounded-md aspect-video mb-4 overflow-hidden">
                                {article.featuredImage ? (
                                  <img
                                    src={article.featuredImage.url}
                                    alt={article.featuredImage.alt || article.title || 'Article image'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 p-6 pt-0">
                              <h3 className="text-xl tracking-tight">{article.title || 'Untitled'}</h3>
                              <p className="text-muted-foreground text-base line-clamp-3">
                                {article.description || 'No description available'}
                              </p>
                              <div className="text-sm text-muted-foreground">
                                {article.author && (
                                  <div className="flex items-center gap-2">
                                    <span>By</span>
                                    {article.authorImage?.url ? (
                                      <Avatar className="h-4 w-4">
                                        <AvatarImage 
                                          src={article.authorImage.url} 
                                          alt={article.authorImage.alt || article.author}
                                        />
                                        <AvatarFallback>
                                          {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <Skeleton className="h-4 w-4 rounded-full" />
                                    )}
                                    <span>{article.author}</span>
                                    {article.date && <span> • {article.date}</span>}
                                  </div>
                                )}
                                {!article.author && article.date && <span>{article.date}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle className="text-left">{article.title || 'Untitled'}</DrawerTitle>
                            <DrawerDescription className="text-left">
                              {article.description || 'No description available'}
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 pb-0">
                            <div className="flex items-center justify-between space-x-2 mb-4">
                              <div className="flex items-center gap-2">
                                {article.category && (
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    {article.category}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{article.readTime} min read</span>
                                </div>
                              </div>
                            </div>
                            {article.author && (
                              <div className="flex items-center gap-2 mb-4">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{article.author}</span>
                                {article.date && (
                                  <>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">{article.date}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <DrawerFooter>
                            <Button onClick={() => window.location.href = article.url || '#'}>
                              Read Full Article
                            </Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => window.location.href = article.url || '#'}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Article
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => openInNewTab(article.url || '#')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => copyArticleLink(article.url || '#', article.title || 'Untitled')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => shareArticle(article.url || '#', article.title || 'Untitled')}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Article
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => bookmarkArticle(article.title || 'Untitled')}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Bookmark
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestBlog;