import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  BadgeDollarSign,
  Bike,
  BookHeart,
  BriefcaseBusiness,
  Calendar,
  ClockIcon,
  Cpu,
  FlaskRound,
  HeartPulse,
  Scale,
  SearchIcon,
} from "lucide-react";

interface BlogProps {
  title?: string;
  showCategories?: boolean;
  postsPerPage?: number;
  blogPage?: string;
  articles?: Article[];
  searchQuery?: string;
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
  } = props;

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Update search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, []);

  // Use articles from props, no fallback data
  const allArticles: Article[] = articleData;

  // Filter articles based on search query and selected category
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

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    return filtered;
  }, [allArticles, searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return dateString; // Already formatted from Kirby
  };

  return (
    <div className="max-w-screen-xl mx-auto py-10 lg:py-16 px-6 xl:px-10 flex flex-col lg:flex-row items-start gap-12">
      <div className="flex-1">
        {/* Title and Search on same row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          
          {/* Search Input */}
          <div className="relative sm:max-w-xs w-full">
            <SearchIcon className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-10 pe-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Results counter */}
        <div className="mt-4 text-sm text-muted-foreground">
          {searchQuery || selectedCategory ? (
            <>
              Showing {filteredArticles.length} of {allArticles.length} articles
              {searchQuery && (
                <span> for "{searchQuery}"</span>
              )}
              {selectedCategory && (
                <span> in {selectedCategory}</span>
              )}
            </>
          ) : (
            <>Showing {allArticles.length} articles</>
          )}
        </div>

        <div className="mt-4 space-y-12">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((article: Article, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center shadow-none overflow-hidden rounded-md border-none"
              >
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

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                    <a href={article.url} className="hover:text-primary transition-colors">
                      {article.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-muted-foreground line-clamp-3 text-ellipsis">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" /> {article.readTime} min read
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {formatDate(article.date)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search or filter criteria."
                  : "No articles are available at the moment."
                }
              </p>
            </div>
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
          <h3 className="text-3xl font-bold tracking-tight">Categories</h3>
          <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
            {/* All Categories option */}
            <div
              onClick={() => handleCategoryChange(null)}
              className={cn(
                "flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25 cursor-pointer hover:bg-opacity-25 transition-colors",
                selectedCategory === null ? "ring-2 ring-primary" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary" />
                <span className="font-medium">All Categories</span>
              </div>
              <Badge className="px-1.5 rounded-full">
                {allArticles.length}
              </Badge>
            </div>
            
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={cn(
                    "flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25 cursor-pointer hover:bg-opacity-25 transition-colors",
                    category.background,
                    selectedCategory === category.name ? "ring-2 ring-primary" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={cn("h-5 w-5", category.color)} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Badge className="px-1.5 rounded-full">
                    {category.totalPosts}
                  </Badge>
                </div>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Blog;