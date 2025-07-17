import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "lucide-react";

interface BlogProps {
  title?: string;
  showCategories?: boolean;
  postsPerPage?: number;
  blogPage?: string;
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
    postsPerPage = 8,
    articles: articleData = [],
  } = props;

  // Use articles from props if available, otherwise fall back to mock data
  const articles: Article[] = articleData.length > 0 ? articleData : [
    {
      title: "A beginner's guide to blockchain for engineers",
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa consequatur minus dicta accusantium quos, ratione suscipit id adipisci voluptatibus. Nulla sint repudiandae fugiat tenetur dolores.",
      category: "Technology",
      date: "Nov 20, 2024",
      readTime: 5,
      url: "/blog/blockchain-guide",
      author: "John Doe"
    },
    {
      title: "Top business trends for 2025",
      description: "Discover the key business trends that will shape 2025 and how companies can prepare for the future of work.",
      category: "Business",
      date: "Nov 15, 2024",
      readTime: 3,
      url: "/blog/business-trends",
      author: "Jane Smith"
    },
    {
      title: "Essential health tips for remote workers",
      description: "Learn essential health tips to maintain your wellbeing while working from home.",
      category: "Health",
      date: "Nov 10, 2024",
      readTime: 4,
      url: "/blog/health-tips",
      author: "Dr. Sarah Johnson"
    }
  ];

  // Calculate category counts
  const categoryCounts = articles.reduce((acc: Record<string, number>, article: Article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    totalPosts: count,
    ...categoryIcons[name as keyof typeof categoryIcons]
  })).filter(category => category.icon); // Only include categories with icons

  const formatDate = (dateString: string) => {
    return dateString; // Already formatted from Kirby
  };

  return (
    <div className="max-w-screen-xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start gap-12">
      <div className="flex-1">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>

        <div className="mt-4 space-y-12">
          {articles.slice(0, postsPerPage).map((article: Article, i: number) => (
            <Card
              key={i}
              className="flex flex-col sm:flex-row sm:items-center shadow-none overflow-hidden rounded-md border-none"
            >
              <CardHeader className="px-0 sm:p-0">
                <div className="aspect-video sm:w-56 sm:aspect-square bg-muted rounded-lg" />
              </CardHeader>
              <CardContent className="px-0 sm:px-6 py-0 flex flex-col">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {showCategories && categories.length > 0 && (
        <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full">
          <h3 className="text-3xl font-bold tracking-tight">Categories</h3>
          <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className={cn(
                    "flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25",
                    category.background
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
