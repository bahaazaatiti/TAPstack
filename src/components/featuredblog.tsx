import React from "react";
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
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Copy, 
  Share2, 
  Bookmark, 
  Clock,
  User
} from "lucide-react";
import { toast } from "sonner";

interface FeaturedBlogProps {
  title?: string;
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
  author: string;
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

const FeaturedBlog: React.FC<FeaturedBlogProps> = (props) => {
  const {
    title = "Latest articles",
    articles: articleData = []
  } = props;

  // Use articles from props (now always provided by pass-block-data.php)
  const articles: Article[] = articleData;

  // Blueprint max: 3 constraint handles limiting, so use all provided articles
  const featuredArticles = articles;

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
    <div className="w-full py-10 lg:py-16 px-6 xl:px-16">
      <div className="container mx-auto flex flex-col gap-12">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-bold">
            {title}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredArticles.map((article, index) => (
            <ContextMenu key={index}>
              <ContextMenuTrigger asChild>
                <div className={`${index === 0 ? 'md:col-span-2' : ''}`}>
                  {/* Desktop: Regular link with HoverCard */}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <a
                        href={article.url}
                        className="hidden md:block hover:opacity-75 cursor-pointer"
                      >
                        <Card className="border-none shadow-none hover:shadow-md transition-shadow">
                          <CardHeader className="p-0">
                            <div className="bg-muted rounded-md aspect-video overflow-hidden">
                              {article.featuredImage ? (
                                <img
                                  src={article.featuredImage.url}
                                  alt={article.featuredImage.alt}
                                  className="w-full h-full object-cover"
                                />
                              ) : null}
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-4 p-6">
                            <div className="flex flex-row gap-4 items-center">
                              <Badge>{article.category}</Badge>
                              <div className="flex flex-row gap-2 text-sm items-center">
                                <span className="text-muted-foreground">By</span>
                                {article.authorImage?.url ? (
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage 
                                      src={article.authorImage.url} 
                                      alt={article.authorImage.alt || article.author}
                                    />
                                    <AvatarFallback>
                                      {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Skeleton className="h-6 w-6 rounded-full" />
                                )}
                                <span>{article.author}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h3 className={`max-w-3xl tracking-tight ${
                                index === 0 ? 'text-4xl' : 'text-2xl'
                              }`}>
                                {article.title}
                              </h3>
                              <p className="max-w-3xl text-muted-foreground text-base">
                                {article.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold leading-none">{article.title}</h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            {article.description}
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
                        <Card className="border-none shadow-none hover:shadow-md transition-shadow">
                          <CardHeader className="p-0">
                            <div className="bg-muted rounded-md aspect-video overflow-hidden">
                              {article.featuredImage ? (
                                <img
                                  src={article.featuredImage.url}
                                  alt={article.featuredImage.alt}
                                  className="w-full h-full object-cover"
                                />
                              ) : null}
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-4 p-6">
                            <div className="flex flex-row gap-4 items-center">
                              <Badge>{article.category}</Badge>
                              <div className="flex flex-row gap-2 text-sm items-center">
                                <span className="text-muted-foreground">By</span>
                                {article.authorImage?.url ? (
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage 
                                      src={article.authorImage.url} 
                                      alt={article.authorImage.alt || article.author}
                                    />
                                    <AvatarFallback>
                                      {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Skeleton className="h-6 w-6 rounded-full" />
                                )}
                                <span>{article.author}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h3 className={`max-w-3xl tracking-tight ${
                                index === 0 ? 'text-4xl' : 'text-2xl'
                              }`}>
                                {article.title}
                              </h3>
                              <p className="max-w-3xl text-muted-foreground text-base line-clamp-3">
                                {article.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                          <DrawerTitle className="text-start">{article.title}</DrawerTitle>
                          <DrawerDescription className="text-start">
                            {article.description}
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0">
                          <div className="flex items-center justify-between space-x-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{article.category}</Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{article.readTime} min read</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{article.author}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{article.date}</span>
                          </div>
                        </div>
                        <DrawerFooter>
                          <Button onClick={() => window.location.href = article.url}>
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
                <ContextMenuItem onClick={() => window.location.href = article.url}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Article
                </ContextMenuItem>
                <ContextMenuItem onClick={() => openInNewTab(article.url)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => copyArticleLink(article.url, article.title)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </ContextMenuItem>
                <ContextMenuItem onClick={() => shareArticle(article.url, article.title)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Article
                </ContextMenuItem>
                <ContextMenuItem onClick={() => bookmarkArticle(article.title)}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Bookmark
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlog;