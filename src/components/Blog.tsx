import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  BadgeDollarSign,
  Bike,
  BookHeart,
  BriefcaseBusiness,
  Calendar as CalendarIcon,
  ClockIcon,
  Cpu,
  FlaskRound,
  HeartPulse,
  Scale,
  SearchIcon,
  SlidersHorizontal,
  X,
  Check,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
} from "lucide-react";

interface BlogProps {
  title?: string;
  showCategories?: boolean;
  postsPerPage?: number;
  blogPage?: string;
  articles?: Article[];
  searchQuery?: string;
  blogParam?: string; // For parent-specific blog search
  blogParamTitle?: string; // For displaying the localized blog title
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

const categoryIcons = {
  Technology: { icon: Cpu, background: "bg-indigo-500", color: "text-indigo-500" },
  Business: { icon: BriefcaseBusiness, background: "bg-amber-500", color: "text-amber-500" },
  Finance: { icon: BadgeDollarSign, background: "bg-emerald-500", color: "text-emerald-500" },
  Health: { icon: HeartPulse, background: "bg-rose-500", color: "text-rose-500" },
  Lifestyle: { icon: BookHeart, background: "bg-cyan-500", color: "text-cyan-500" },
  Politics: { icon: Scale, background: "bg-teal-500", color: "text-teal-500" },
  Science: { icon: FlaskRound, background: "bg-purple-500", color: "text-purple-500" },
  Sports: { icon: Bike, background: "bg-cyan-500", color: "text-cyan-500" },
};

const Blog: React.FC<BlogProps> = (props) => {
  const {
    title = "Posts",
    showCategories = true,
    postsPerPage = 20,
    articles: articleData = [],
    searchQuery: initialSearchQuery = "",
    blogParam = "",
    blogParamTitle = "",
    translations = {},
  } = props;

  // Dynamic sort options using translations
  const sortOptions = [
    { value: "date-desc", label: translations.newest_first || "Newest First", key: "date", order: "desc" },
    { value: "date-asc", label: translations.oldest_first || "Oldest First", key: "date", order: "asc" },
    { value: "readtime-asc", label: translations.quick_reads || "Quick Reads", key: "readTime", order: "asc" },
    { value: "readtime-desc", label: translations.long_reads || "Long Reads", key: "readTime", order: "desc" },
    { value: "title-asc", label: translations.a_to_z || "A to Z", key: "title", order: "asc" },
    { value: "title-desc", label: translations.z_to_a || "Z to A", key: "title", order: "desc" },
  ];

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("date-desc");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, []);

  // Use articles from props, no fallback data
  const allArticles: Article[] = articleData;

  // Generate search suggestions from article titles
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = allArticles
        .filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(article => article.title)
        .slice(0, 5);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, allArticles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = allArticles;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(article => selectedCategories.includes(article.category));
    }

    // Filter by date range
    if (selectedDateRange?.from || selectedDateRange?.to) {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.date);
        const fromDate = selectedDateRange?.from;
        const toDate = selectedDateRange?.to;
        
        if (fromDate && toDate) {
          return articleDate >= fromDate && articleDate <= toDate;
        } else if (fromDate) {
          return articleDate >= fromDate;
        } else if (toDate) {
          return articleDate <= toDate;
        }
        return true;
      });
    }

    // Sort articles
    const sortConfig = sortOptions.find(opt => opt.value === sortOption);
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        if (sortConfig.key === "date") {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else if (sortConfig.key === "readTime") {
          aValue = a.readTime;
          bValue = b.readTime;
        } else if (sortConfig.key === "title") {
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
        }
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (sortConfig.order === "desc") {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [allArticles, searchQuery, selectedCategories, sortOption, selectedDateRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, sortOption]);

  // Calculate category counts from all articles
  const categoryCounts = allArticles.reduce((acc: Record<string, number>, article: Article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    totalPosts: count,
    ...categoryIcons[name as keyof typeof categoryIcons]
  })).filter(category => category.icon); // Only include categories with icons

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleCategoryClick = (category: string) => {
    // Toggle category selection
    handleCategoryToggle(category);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setIsCalendarOpen(false);
  };

  const clearDateFilter = () => {
    setSelectedDateRange(undefined);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortOption("date-desc");
    setSelectedDateRange(undefined);
  };

  // Article preview content component
  const ArticlePreview: React.FC<{ article: Article }> = ({ article }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {article.category}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(article.date).toLocaleDateString()}
        </span>
      </div>
      
      {article.featuredImage && (
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div>
        <h4 className="font-semibold line-clamp-2">{article.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
          {article.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {article.authorImage?.url ? (
            <Avatar className="h-4 w-4">
              <AvatarImage 
                src={article.authorImage.url} 
                alt={article.authorImage.alt || article.author}
              />
              <AvatarFallback className="text-xs">
                {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : null}
          <span>{translations.by || "By"} {article.author}</span>
        </div>
        <span>{article.readTime} {translations.min_read || "min read"} </span>
      </div>
      
      <div className="pt-2">
        <Button asChild size="sm" className="w-full">
          <a href={article.url}>{translations.read_article || "Read Article"}</a>
        </Button>
      </div>
    </div>
  );

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

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || sortOption !== "date-desc" || selectedDateRange?.from || selectedDateRange?.to;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return dateString; // Already formatted from Kirby
  };

  return (
    <div className="max-w-screen-xl mx-auto py-10 lg:py-16 px-6 xl:px-10 flex flex-col lg:flex-row items-start gap-12">
      <div className="flex-1">
        {/* Header with Title and Advanced Search */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight">
                {blogParamTitle ? `${title} - ${blogParamTitle}` : title}
              </h2>
              {blogParamTitle && (
                <p className="text-sm text-muted-foreground">
                  {translations.searching_within || "Searching within"} {blogParamTitle}
                </p>
              )}
            </div>
            
            {/* Enhanced Search with Command */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isSearchOpen}
                    className="flex-1 sm:w-80 justify-between"
                  >
                    {searchQuery || (translations.search_articles || "Search articles...")}
                    <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput 
                      placeholder={translations.search_articles || "Search articles..."} 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>{translations.no_articles_found || "No articles found."}</CommandEmpty>
                      {searchSuggestions.length > 0 && (
                        <CommandGroup heading={translations.suggestions || "Suggestions"}>
                          {searchSuggestions.map((suggestion) => (
                            <CommandItem
                              key={suggestion}
                              onSelect={() => {
                                setSearchQuery(suggestion);
                                setIsSearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  searchQuery === suggestion ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {suggestion}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Date Range Picker */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative shrink-0">
                    <CalendarIcon className="h-4 w-4" />
                    {(selectedDateRange?.from || selectedDateRange?.to) && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={selectedDateRange}
                    onSelect={handleDateRangeSelect}
                    initialFocus
                    numberOfMonths={2}
                  />
                  {(selectedDateRange?.from || selectedDateRange?.to) && (
                    <div className="p-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearDateFilter}
                        className="w-full"
                      >
                        {translations.clear_date_filter || "Clear Date Filter"}
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              
              {/* Advanced Filters Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">{translations.categories || "Categories"}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <div key={category.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.name}
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={() => handleCategoryToggle(category.name)}
                            />
                            <Label 
                              htmlFor={category.name} 
                              className="text-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <category.icon className="h-3 w-3" />
                              {category.name}
                              <span className="text-muted-foreground">({category.totalPosts})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">{translations.sort_by || "Sort By"}</h4>
                      <RadioGroup value={sortOption} onValueChange={setSortOption}>
                        {sortOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="text-sm cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    {hasActiveFilters && (
                      <>
                        <Separator />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleClearAllFilters}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          {translations.clear_all_filters || "Clear All Filters"}
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{translations.active_filters || "Active filters:"}</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  {translations.search_label || "Search:"} "{searchQuery}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleCategoryToggle(category)}
                  />
                </Badge>
              ))}
              {(selectedDateRange?.from || selectedDateRange?.to) && (
                <Badge variant="secondary" className="gap-1">
                  {translations.date_label || "Date:"} {selectedDateRange?.from?.toLocaleDateString()}
                  {selectedDateRange?.to && ` - ${selectedDateRange.to.toLocaleDateString()}`}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={clearDateFilter}
                  />
                </Badge>
              )}
              {sortOption !== "date-desc" && (
                <Badge variant="secondary" className="gap-1">
                  {translations.sort_label || "Sort:"} {sortOptions.find(opt => opt.value === sortOption)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSortOption("date-desc")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results counter */}
        <div className="mt-6 text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <>
              {translations.showing || "Showing"} {filteredArticles.length} {translations.of || "of"} {allArticles.length} {translations.articles || "articles"}
              {searchQuery && (
                <span> {translations.for_search || "for"} "{searchQuery}"</span>
              )}
              {selectedCategories.length > 0 && (
                <span> {translations.in_categories || "in"} {selectedCategories.join(", ")}</span>
              )}
              {blogParamTitle && (
                <span> {translations.from_blog || "from"} {blogParamTitle} </span>
              )}
            </>
          ) : (
            <>
              {translations.showing || "Showing"} {allArticles.length} {translations.articles || "articles"}
              {blogParamTitle && (
                <span> {translations.from_blog || "from"} {blogParamTitle}</span>
              )}
            </>
          )}
        </div>

        <div className="mt-4 space-y-6">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((article: Article, i: number) => (
              <div key={i}>
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Card className="shadow-none border-none cursor-pointer">
                      <CardContent className="p-0">
                        {isMobile ? (
                          <Drawer>
                            <DrawerTrigger asChild>
                              <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden hover:bg-muted/50 transition-colors rounded-lg p-2 -m-2 gap-2">
                                <div className="px-0 sm:p-0 flex-shrink-0 pb-2">
                                  {article.featuredImage ? (
                                    <div className="aspect-video  sm:w-56 sm:aspect-square bg-muted rounded-lg overflow-hidden">
                                      <img
                                        src={article.featuredImage.url}
                                        alt={article.featuredImage.alt}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-video sm:w-56 sm:aspect-square bg-muted rounded-lg" />
                                  )}
                                </div>
                                <div className="px-4 sm:px-6 py-0 flex flex-col">
                                  <div className="flex items-center gap-6">
                                    <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                                      {article.category}
                                    </Badge>
                                  </div>

                                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                                    {article.title}
                                  </h3>
                                  <p className="mt-2 text-muted-foreground line-clamp-3 text-ellipsis">
                                    {article.description}
                                  </p>
                                  <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                      {article.authorImage?.url ? (
                                        <Avatar className="h-5 w-5">
                                          <AvatarImage 
                                            src={article.authorImage.url} 
                                            alt={article.authorImage.alt || article.author}
                                          />
                                          <AvatarFallback>
                                            {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <Skeleton className="h-5 w-5 rounded-full" />
                                      )}
                                      <span>{translations.by || "By"} {article.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <ClockIcon className="h-4 w-4" /> {article.readTime} {translations.min_read || "min read"} 
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon className="h-4 w-4" /> {formatDate(article.date)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>{translations.article_preview || "Article Preview"}</DrawerTitle>
                                <DrawerDescription>
                                  {translations.quick_preview_of || "Quick preview of"} {article.title}
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
                                <ArticlePreview article={article} />
                              </div>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">{translations.close || "Close"}</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        ) : (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden transition-colors rounded-lg p-2 -m-2 cursor-pointer">
                                <div className="px-0 sm:p-0 flex-shrink-0 pb-2">
                                  {article.featuredImage ? (
                                    <div className="aspect-video  sm:w-56 sm:aspect-square bg-muted rounded-lg overflow-hidden">
                                      <img
                                        src={article.featuredImage.url}
                                        alt={article.featuredImage.alt}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-video sm:w-56 sm:aspect-square bg-muted rounded-lg" />
                                  )}
                                </div>
                                <div className="px-0 sm:px-6 py-0 flex flex-col">
                                  <div className="flex items-center gap-6">
                                    <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                                      {article.category}
                                    </Badge>
                                  </div>

                                  <h3 className="mt-4 text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
                                    <a href={article.url} className="hover:text-primary transition-colors">
                                      {article.title}
                                    </a>
                                  </h3>
                                  <p className="mt-2 text-muted-foreground line-clamp-3 text-ellipsis">
                                    {article.description}
                                  </p>
                                  <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                      {article.authorImage?.url ? (
                                        <Avatar className="h-5 w-5">
                                          <AvatarImage 
                                            src={article.authorImage.url} 
                                            alt={article.authorImage.alt || article.author}
                                          />
                                          <AvatarFallback>
                                            {article.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      ) : (
                                        <Skeleton className="h-5 w-5 rounded-full" />
                                      )}
                                      <span>{translations.by || "By"} {article.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <ClockIcon className="h-4 w-4" /> {article.readTime} {translations.min_read || "min read"} 
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon className="h-4 w-4" /> {formatDate(article.date)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </HoverCardTrigger>
                              <HoverCardContent className="w-80" side="top">
                              <ArticlePreview article={article} />
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </CardContent>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem 
                      onClick={() => copyArticleLink(article.url, article.title)}
                      className="cursor-pointer"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {translations.copy_link || "Copy Link"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => shareArticle(article.url, article.title)}
                      className="cursor-pointer"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {translations.share_article || "Share Article"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => bookmarkArticle(article.title)}
                      className="cursor-pointer"
                    >
                      <Bookmark className="mr-2 h-4 w-4" />
                      {translations.bookmark || "Bookmark"}
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem 
                      onClick={() => openInNewTab(article.url)}
                      className="cursor-pointer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {translations.open_in_new_tab || "Open in New Tab"}
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
                {i < paginatedArticles.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))
          ) : (
            <Alert className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <SearchIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <AlertDescription className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">{translations.no_results_found || "No results found"}</h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters 
                    ? (translations.try_adjusting_search || "Try adjusting your search or filter criteria.")
                    : (translations.no_articles_available || "No articles are available at the moment.")
                  }
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      
      {showCategories && categories.length > 0 && (
        <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full">
          <h3 className="text-xl font-semibold tracking-tight mb-4">{translations.cat_browser || "Browse by Category"}</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategories.includes(category.name);
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={cn(
                    "flex items-center justify-between gap-2 p-3 rounded-lg transition-colors cursor-pointer",
                    "bg-muted/50 hover:bg-muted",
                    isSelected && "bg-primary/10 border border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={cn("h-4 w-4", category.color)} />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    {category.totalPosts}
                  </Badge>
                </div>
              );
            })}
          </div>
          
          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAllFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                {translations.clear_all_filters || "Clear All Filters"}
              </Button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default Blog;