import React from "react";
import DottedMap from "dotted-map";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building } from "lucide-react";

interface WorldMapHeroProps {
  title?: string;
  subtitle?: string;
  bottomtext?: string;
  articles?: ArticleLocation[];
}

interface ArticleLocation {
  lat: number;
  lng: number;
  label: string;
  population: string;
  associations: string[];
  url: string;
  author: string;
  category: string;
  date: string;
  readTime: number;
}

const WorldMapHero: React.FC<WorldMapHeroProps> = ({
  title = "Connected Across Continents",
  subtitle = "Our presence spans across continents.",
  bottomtext = "For a United Assembly of Alawites worldwide.",
  articles: articleData = [],
}) => {
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  // Create both light and dark versions of the map
  const lightSvgMap = map.getSVG({
    radius: 0.22,
    color: "#00000040",
    shape: "circle",
    backgroundColor: "white",
  });

  const darkSvgMap = map.getSVG({
    radius: 0.22,
    color: "#FFFFFF40", 
    shape: "circle",
    backgroundColor: "black",
  });

  const projectPoint = (lat: number, lng: number) => {
    // dotted-map uses a specific coordinate system that matches SVG viewBox
    // The map dimensions are based on the library's internal projection
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  // Use articles from props, with fallback to static data for demo
  const locations: ArticleLocation[] = articleData.length > 0 ? articleData : [
    { 
      lat: 33.82, 
      lng: 35.48, 
      label: "Lebanon",
      population: "150 Thousand",
      associations: ["Alawite Islamic Charity Association"],
      url: "/lebanon",
      author: "Demo Author",
      category: "Geography",
      date: "Nov 20, 2024",
      readTime: 5
    },
  ];

  const dotColor = "#4b7346";

  // Reset mobile zoom to default by temporarily setting the viewport meta tag.
  // Many mobile browsers will reset the visual zoom when viewport's initial-scale/maximum-scale are changed.
  const resetMobileZoom = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!meta) return;
      // store original content so we can restore it
      if (!meta.dataset.originalContent) {
        meta.dataset.originalContent = meta.content || '';
      }
      // Set a strict viewport to force the browser to reset zoom to 1
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      // A tiny delay then restore the original viewport so zooming can be used again
      window.setTimeout(() => {
        if (meta.dataset.originalContent !== undefined) {
          meta.content = meta.dataset.originalContent;
          // keep dataset so subsequent taps still work
        }
      }, 700);
      // also try a small scroll/resize to encourage layout repaint on some browsers
      window.scrollTo(window.scrollX, window.scrollY);
    } catch (e) {
      // no-op
    }
  };

  return (
    <section className="w-full py-16 lg:px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* World Map */}
        <div className="w-full aspect-[2/1] bg-background rounded-lg relative font-sans border border-border">
          {/* Light theme map */}
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(lightSvgMap)}`}
            className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none dark:hidden"
            alt="world map"
            height="495"
            width="1056"
            draggable={false}
          />
          {/* Dark theme map */}
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(darkSvgMap)}`}
            className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none hidden dark:block"
            alt="world map"
            height="495"
            width="1056"
            draggable={false}
          />
          
          {/* SVG Dots Layer */}
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full absolute inset-0 pointer-events-none select-none"
          >
            <defs>
              <linearGradient id="dot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={dotColor} stopOpacity="1" />
                <stop offset="100%" stopColor={dotColor} stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="highlight-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fadc5e" stopOpacity="1" />
                <stop offset="100%" stopColor="#fadc5e" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Render main location dots */}
            {locations.map((location, i) => {
              const point = projectPoint(location.lat, location.lng);
              return (
                <g key={`location-${i}`}>
                  {/* Main dot */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="url(#dot-gradient)"
                    className="transition-all duration-200 ease-out"
                    data-country={i}
                    data-main="true"
                  />
                  {/* Pulsing ring animation */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={dotColor}
                    className="animate-pulse opacity-60"
                    data-country={i}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Overlay Layer for Hover/Click */}
          {locations.map((location, i) => {
            const point = projectPoint(location.lat, location.lng);
            // Convert SVG coordinates to percentage for absolute positioning
            const leftPercent = (point.x / 800) * 100;
            const topPercent = (point.y / 400) * 100;
            
            return (
              <div key={`overlay-${i}`} className="group">
                {/* Desktop: HoverCard */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div 
                      className="absolute hidden md:block w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onMouseEnter={() => {
                        // Highlight main dot
                        const mainDot = document.querySelector(`[data-country="${i}"][data-main="true"]`);
                        if (mainDot) {
                          (mainDot as SVGElement).setAttribute('r', '5');
                          (mainDot as SVGElement).setAttribute('fill', 'url(#highlight-gradient)');
                        }
                      }}
                      onMouseLeave={() => {
                        // Reset main dot
                        const mainDot = document.querySelector(`[data-country="${i}"][data-main="true"]`);
                        if (mainDot) {
                          (mainDot as SVGElement).setAttribute('r', '4');
                          (mainDot as SVGElement).setAttribute('fill', 'url(#dot-gradient)');
                        }
                      }}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold leading-none">{location.label}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Population: {location.population}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Alawite Organizations</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {location.associations.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button asChild size="sm" className="w-full">
                          <a href={location.url}>Read Article</a>
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* Mobile: Drawer */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <div 
                      className="absolute md:hidden w-8 h-8 cursor-pointer"
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => {
                        // when tapping a dot on mobile, reset zoom to default so drawer is usable
                        resetMobileZoom();
                      }}
                    />
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle className="text-start">{location.label}</DrawerTitle>
                        <DrawerDescription className="text-start">
                          Population: {location.population}
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Alawite Organizations</span>
                          </div>
                          <div className="space-y-2">
                            {location.associations.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="mr-2">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button asChild>
                          <a href={location.url}>Read Article</a>
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            );
          })}
        </div>

        {/* Optional subtitle or call-to-action */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {bottomtext}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WorldMapHero;
