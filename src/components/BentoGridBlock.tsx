import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BentoGridBlockProps {
  title?: string;
  articles?: Article[];
  gridStyle?: 'default' | 'large-first' | 'balanced';
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
    title = "Featured Articles",
    articles: articleData = [],
    gridStyle = 'default'
  } = props;

  // Use articles from props if available, otherwise fall back to mock data
  const articles: Article[] = articleData.length > 0 ? articleData : [
    {
      title: "Getting Started with React",
      description: "Learn the fundamentals of React development and build your first component.",
      category: "Technology",
      date: "Nov 20, 2024",
      readTime: 5,
      url: "/blog/react-guide",
      author: "John Doe",
      featuredImage: null
    },
    {
      title: "Modern Web Design Trends",
      description: "Explore the latest trends in web design and user experience.",
      category: "Design",
      date: "Nov 15, 2024",
      readTime: 7,
      url: "/blog/web-design",
      author: "Jane Smith",
      featuredImage: null
    },
    {
      title: "JavaScript Best Practices",
      description: "Essential tips and tricks for writing clean, maintainable JavaScript code.",
      category: "Programming",
      date: "Nov 10, 2024",
      readTime: 6,
      url: "/blog/js-practices",
      author: "Alex Johnson",
      featuredImage: null
    },
    {
      title: "CSS Grid vs Flexbox",
      description: "Understanding when to use CSS Grid versus Flexbox for layouts.",
      category: "CSS",
      date: "Nov 5, 2024",
      readTime: 4,
      url: "/blog/css-layout",
      author: "Sarah Wilson",
      featuredImage: null
    }
  ];

  // Limit articles based on grid style
  const maxArticles = gridStyle === 'large-first' ? 5 : 6;
  const displayArticles = articles.slice(0, maxArticles);

  const HeaderComponent = ({ article }: { article: Article }) => (
    <>
      {article.featuredImage ? (
        <div className="w-full h-full min-h-[6rem] bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-lg overflow-hidden">
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

  return (
    <div className="w-full py-10 lg:py-16 px-6 xl:px-10">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            {title}
          </h4>
        </div>
        
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[18rem]">
            {displayArticles.map((article, index) => {
              // Group items in pairs for the 2-per-row layout
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
                <a
                  key={index}
                  href={article.url}
                  className={`block transition-transform hover:scale-[1.02] ${colSpanClass}`}
                >
                <Card className="group/bento transition-transform hover:scale-[1.02] h-full">
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
                          {article.category}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGridBlock;
