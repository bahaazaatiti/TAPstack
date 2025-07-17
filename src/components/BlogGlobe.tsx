import React from "react";
import { World } from "@/components/ui/globe";

interface BlogGlobeProps {
  title?: string;
  description?: string;
  articles?: GlobeArticle[];
  globeConfig?: any;
  [key: string]: any;
}

interface GlobeArticle {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: number;
  url: string;
  author: string;
  latitude: number;
  longitude: number;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
}

// Category color mapping for consistent globe dots (using shadcn/ui compatible colors)
const categoryColors = {
  Technology: "hsl(221.2 83.2% 53.3%)", // Blue
  Business: "hsl(32.5 94.6% 43.7%)",   // Orange  
  Finance: "hsl(142.1 76.2% 36.3%)",   // Green
  Health: "hsl(346.8 77.2% 49.8%)",    // Red
  Lifestyle: "hsl(188.7 85% 53.3%)",   // Cyan
  Politics: "hsl(173.4 80.4% 40%)",    // Teal
  Science: "hsl(262.1 83.3% 57.8%)",   // Purple
  Sports: "hsl(188.7 85% 53.3%)",      // Cyan
  Travel: "hsl(20.5 90.2% 48.2%)",     // Orange
  Food: "hsl(84.8 85.2% 40.4%)",       // Lime
  Default: "hsl(var(--primary))",       // Primary theme color
};

const BlogGlobe: React.FC<BlogGlobeProps> = (props) => {
  const {
    title = "Stories Around the World",
    description = "Explore our articles from around the globe",
    articles: articleData = [],
    globeConfig = {},
  } = props;

  // Use articles from props if available, otherwise fall back to mock data
  const articles: GlobeArticle[] = articleData.length > 0 ? articleData : [
    {
      title: "Tech Innovation in Silicon Valley",
      description: "The latest developments in AI and machine learning",
      category: "Technology",
      date: "Nov 20, 2024",
      readTime: 5,
      url: "/blog/tech-innovation",
      author: "John Doe",
      latitude: 37.4419,
      longitude: -122.1430
    },
    {
      title: "Business Trends in London",
      description: "How European markets are adapting to new challenges",
      category: "Business",
      date: "Nov 15, 2024",
      readTime: 3,
      url: "/blog/business-trends",
      author: "Jane Smith",
      latitude: 51.5074,
      longitude: -0.1278
    },
    {
      title: "Cultural Stories from Tokyo",
      description: "Exploring traditional and modern Japanese culture",
      category: "Lifestyle",
      date: "Nov 10, 2024",
      readTime: 4,
      url: "/blog/tokyo-culture",
      author: "Yuki Tanaka",
      latitude: 35.6762,
      longitude: 139.6503
    }
  ];

  // Filter articles that have valid coordinates
  const articlesWithCoordinates = articles.filter(
    article => 
      article.latitude && 
      article.longitude && 
      !isNaN(article.latitude) && 
      !isNaN(article.longitude) &&
      article.latitude >= -90 && article.latitude <= 90 &&
      article.longitude >= -180 && article.longitude <= 180
  );

  // Convert articles to globe points
  const globeData = articlesWithCoordinates.map(article => ({
    lat: article.latitude,
    lng: article.longitude,
    color: categoryColors[article.category as keyof typeof categoryColors] || categoryColors.Default,
    size: 1.5,
    article: {
      title: article.title,
      url: article.url,
      category: article.category,
      date: article.date,
      author: article.author,
      description: article.description
    }
  }));

  const defaultGlobeConfig = {
    pointSize: 2,
    globeColor: "hsl(var(--card))",
    showAtmosphere: true,
    atmosphereColor: "hsl(var(--primary) / 0.3)",
    atmosphereAltitude: 0.15,
    emissive: "hsl(var(--muted))",
    emissiveIntensity: 0.05,
    shininess: 0.1,
    polygonColor: "#22c55e",
    //polygonColor: "hsl(var(--foreground) / 0.08)", // For globe polygons
    ambientLight: "hsl(var(--foreground))",
    directionalLeftLight: "hsl(var(--foreground))",
    directionalTopLight: "hsl(var(--foreground))",
    pointLight: "hsl(var(--foreground))",
    autoRotate: true,
    autoRotateSpeed: 0.5,
    ...globeConfig
  };

  return (
    <div className="w-full py-20 lg:py-20 bg-background text-foreground relative overflow-hidden">
      <div className="container mx-auto px-6 xl:px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          {articlesWithCoordinates.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {articlesWithCoordinates.length} articles from around the world
            </p>
          )}
        </div>
        
        <div className="relative w-full h-[600px] md:h-[800px] rounded-lg border bg-card">
          {articlesWithCoordinates.length > 0 ? (
            <World globeConfig={defaultGlobeConfig} data={globeData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <p className="text-xl text-muted-foreground">No articles with coordinates found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add latitude and longitude to your articles to see them on the globe
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Article Stats */}
        {articlesWithCoordinates.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {articlesWithCoordinates.length}
              </div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {new Set(articlesWithCoordinates.map(a => a.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {new Set(articlesWithCoordinates.map(a => a.author)).size}
              </div>
              <div className="text-sm text-muted-foreground">Authors</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {new Set(articlesWithCoordinates.map(a => 
                  `${Math.round(a.latitude)},${Math.round(a.longitude)}`
                )).size}
              </div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogGlobe;
