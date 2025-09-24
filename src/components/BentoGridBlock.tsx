import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem

} from "@/components/ui/carousel";
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

interface BentoGridBlockProps {
  title?: string;
  articles?: Article[];
  translations?: { 
    [key: string]: any;
  };
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

const BentoGridBlock: React.FC<BentoGridBlockProps> = (props) => {
  const {
    title = props.translations?.featured_articles || "Featured Articles",
    articles: articleData = [],
    translations = {}
  } = props;
    // Helpers to translate category and format labels
    // TODO: MAKE HELPER FUNCTION FOR THIS IN A UTIL FILE AND IMPORT
  const normalizeKey = (prefix: string, s?: string) => {
    if (!s) return ''
    return prefix + s.toLowerCase().replace(/[^a-z0-9]+/g, '_')
  }

  const tCategory = (name?: string) => {
    if (!name) return ''
    return translations[normalizeKey('category_', name)] || name
  }

  // Use articles from props (now always provided by pass-block-data.php)
  const articles: Article[] = articleData;

  // Blueprint max: 6 constraint handles limiting, so use all provided articles
  const displayArticles = articles;

  // Context menu actions
  const copyArticleLink = (url: string, title: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success(`${translations.link_copied || "Link copied:"} ${title}`);
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
    toast.success(`${translations.bookmarked || "Bookmarked:"} ${title}`);
  };

  const openInNewTab = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };
  // TODO, FIX CAROUSEL, REMOVE RTL DETECTION AND CHECK SCROLL-SHEET COMPONENT
  // RTL detection function
  const isRTL = () => {
    if (typeof document !== 'undefined') {
      return document.documentElement.dir === 'rtl' || document.body.classList.contains('rtl');
    }
    return false;
  };

  const HeaderComponent = ({ article }: { article: Article }) => (
    <>
      {article.featuredImage ? (
        <div className="w-full h-[8rem] bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-lg overflow-hidden">
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full min-h-[6rem] bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-lg" />
      )}
    </>
  );

  const ArticleCard = ({ article, index }: { article: Article; index: number }) => {
    // Group items in pairs for the 2-per-row layout (only used in desktop grid)
    const isFirstInPair = index % 2 === 0;
    const rowIndex = Math.floor(index / 2);
    
    let colSpanClass = "";
    if (rowIndex % 2 === 0) {
      // Even rows: narrow first, then wide
      colSpanClass = isFirstInPair ? "md:col-span-1" : "md:col-span-2";
    } else {
      // Odd rows: wide first, then narrow  
      colSpanClass = isFirstInPair ? "md:col-span-2" : "md:col-span-1";
    }

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className={colSpanClass}>
            {/* Desktop: Regular link with HoverCard */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <a
                  href={article.url}
                  className="hidden md:block transition-transform hover:scale-[1.02]"
                >
                  <Card className="group/bento transition-transform hover:scale-[1.02] h-[18rem]">
                    <CardContent className="flex flex-col justify-between space-y-4 p-4 h-full">
                      <HeaderComponent article={article} />
                      <div className="transition duration-200 group-hover/bento:translate-x-2">
                        <div className="mt-2 mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
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
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {tCategory(article.category)}
                          </Badge>
                        </div>
                        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 truncate mb-2">
                          {article.title}
                        </div>
                        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300 line-clamp-1">
                          {article.description}
                        </div>
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
                          {tCategory(article.category)}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime} {translations.min_read || "min read"}</span>
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
                  <Card className="group/bento transition-transform hover:scale-[1.02] h-[18rem]">
                    <CardContent className="flex flex-col justify-between space-y-4 p-4 h-full">
                      <HeaderComponent article={article} />
                      <div className="transition duration-200 group-hover/bento:translate-x-2">
                        <div className="mt-2 mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
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
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {tCategory(article.category)}
                          </Badge>
                        </div>
                        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 truncate mb-2">
                          {article.title}
                        </div>
                        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300 line-clamp-2">
                          {article.description}
                        </div>
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
                        {article.category && (
                          <Badge variant="secondary" className="text-xs">
                            {tCategory(article.category)}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime} {translations.min_read || "min read"}</span>
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
                    <Button onClick={() => window.location.href = article.url}>
                      {translations.read_full_article || "Read Full Article"}
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">{translations.close || "Close"}</Button>
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
            {translations.open_article || "Open Article"}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openInNewTab(article.url)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {translations.open_in_new_tab || "Open in New Tab"}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => copyArticleLink(article.url, article.title)}>
            <Copy className="mr-2 h-4 w-4" />
            {translations.copy_link || "Copy Link"}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => shareArticle(article.url, article.title)}>
            <Share2 className="mr-2 h-4 w-4" />
            {translations.share_article || "Share Article"}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => bookmarkArticle(article.title)}>
            <Bookmark className="mr-2 h-4 w-4" />
            {translations.bookmark || "Bookmark"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <div className="w-full py-6 lg:py-12">
      <div className="px-6 xl:px-10 pb-8 md:pb-14">
        <h4 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground max-w-xl">
          {title}
        </h4>
      </div>
      <div className="container mx-auto flex flex-col gap-14 ps-4">
        
        <div className="max-w-6xl w-full mx-auto">
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[18rem]">
            {displayArticles.map((article, index) => (
              <ArticleCard key={index} article={article} index={index} />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden" dir={isRTL() ? "rtl" : "ltr"}>
            <Carousel
              opts={{
                align: "start",
                direction: isRTL() ? "rtl" : "ltr",
              }}
              className="w-full"
            >
              <CarouselContent>
                {displayArticles.map((article, index) => (
                  <CarouselItem key={index} className="basis-4/5">
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div>
                          {/* Desktop: Regular link with HoverCard */}
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <a
                                href={article.url}
                                className="hidden md:block transition-transform hover:scale-[1.02]"
                              >
                                <Card className="group/bento transition-transform hover:scale-[1.02] h-[18rem]">
                                  <CardContent className="flex flex-col justify-between space-y-4 p-4 h-full">
                                    <HeaderComponent article={article} />
                                    <div className="transition duration-200 group-hover/bento:translate-x-2">
                                      <div className="mt-2 mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
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
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                          {tCategory(article.category)}
                                        </Badge>
                                      </div>
                                      <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 truncate mb-2">
                                        {article.title}
                                      </div>
                                      <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300 line-clamp-2">
                                        {article.description}
                                      </div>
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
                                        {tCategory(article.category)}
                                      </Badge>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>{article.readTime} {translations.min_read || "min read"}</span>
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
                                <Card className="group/bento transition-transform hover:scale-[1.02] h-[18rem]">
                                  <CardContent className="flex flex-col justify-between space-y-4 p-4 h-full">
                                    <HeaderComponent article={article} />
                                    <div className="transition duration-200 group-hover/bento:translate-x-2">
                                      <div className="mt-2 mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
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
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                          {tCategory(article.category)}
                                        </Badge>
                                      </div>
                                      <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 truncate mb-2">
                                        {article.title}
                                      </div>
                                      <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300 line-clamp-2">
                                        {article.description}
                                      </div>
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
                                      {article.category && (
                                        <Badge variant="secondary" className="text-xs">
                                          {tCategory(article.category)}
                                        </Badge>
                                      )}
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{article.readTime} {translations.min_read || "min read"}</span>
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
                                  <Button onClick={() => window.location.href = article.url}>
                                    {translations.read_full_article || "Read Full Article"}
                                  </Button>
                                  <DrawerClose asChild>
                                    <Button variant="outline">{translations.close || "Close"}</Button>
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
                          {translations.open_article || "Open Article"}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => openInNewTab(article.url)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {translations.open_in_new_tab || "Open in New Tab"}
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => copyArticleLink(article.url, article.title)}>
                          <Copy className="mr-2 h-4 w-4" />
                          {translations.copy_link || "Copy Link"}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => shareArticle(article.url, article.title)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          {translations.share_article || "Share Article"}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => bookmarkArticle(article.title)}>
                          <Bookmark className="mr-2 h-4 w-4" />
                          {translations.bookmark || "Bookmark"}
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGridBlock;
