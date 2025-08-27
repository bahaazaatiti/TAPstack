import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
    articles: articleData = [],
  } = props;

  // Use articles from props if available, otherwise fall back to mock data
  const articles: Article[] = articleData.length > 0 ? articleData : [
    {
      title: "A beginner's guide to blockchain for engineers",
      description: "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
      category: "Technology",
      date: "Nov 20, 2024",
      readTime: 5,
      url: "/blog/blockchain-guide",
      author: "John Doe",
      featuredImage: null
    },
    {
      title: "Top business trends for 2025",
      description: "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods.",
      category: "Business",
      date: "Nov 15, 2024",
      readTime: 3,
      url: "/blog/business-trends",
      author: "Jane Smith",
      featuredImage: null
    },
    {
      title: "Essential health tips for remote workers",
      description: "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods.",
      category: "Health",
      date: "Nov 10, 2024",
      readTime: 4,
      url: "/blog/health-tips",
      author: "Dr. Sarah Johnson",
      featuredImage: null
    }
  ];

  // Show up to 3 articles
  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="w-full py-10 lg:py-16 px-6 xl:px-10">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            {title}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredArticles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              className={`flex flex-col gap-4 hover:opacity-75 cursor-pointer ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="bg-muted rounded-md aspect-video overflow-hidden">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage.url}
                    alt={article.featuredImage.alt}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-row gap-4 items-center">
                <Badge>{article.category}</Badge>
                <p className="flex flex-row gap-2 text-sm items-center">
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
                </p>
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlog;