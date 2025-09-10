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
import globeData from "@/data/globe.json";

interface WorldMapHeroProps {
  title?: string;
  [key: string]: any;
}

interface CountryData {
  lat: number;
  lng: number;
  label: string;
  population: string;
  associations: string[];
}

// GeoJSON types
interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    admin: string;
    name: string;
    continent: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Helper function to extract coordinates from GeoJSON geometry
const extractCoordinatesFromGeometry = (geometry: GeoJSONFeature['geometry']): number[][] => {
  let allCoords: number[][] = [];
  
  if (geometry.type === 'Polygon') {
    // For Polygon, coordinates is number[][][]
    const coords = geometry.coordinates as number[][][];
    allCoords = coords[0]; // Take outer ring
  } else if (geometry.type === 'MultiPolygon') {
    // For MultiPolygon, coordinates is number[][][][]
    const coords = geometry.coordinates as number[][][][];
    // Take the largest polygon (usually the main landmass)
    let largestPolygon = coords[0][0];
    for (const polygon of coords) {
      if (polygon[0].length > largestPolygon.length) {
        largestPolygon = polygon[0];
      }
    }
    allCoords = largestPolygon;
  }
  
  return allCoords;
};

// Function to get country boundary coordinates from globe.json
const getCountryCoordinates = (countryName: string): number[][] => {
  const geoData = globeData as GeoJSONData;
  
  // Map display names to admin names in the data
  const countryMapping: Record<string, string> = {
    'Lebanon': 'Lebanon',
    'Argentina': 'Argentina', 
    'United States': 'United States of America',
    'Syria': 'Syria',
    'Australia': 'Australia',
    'Canada': 'Canada',
    'Germany': 'Germany',
    'France': 'France',
  };
  
  const adminName = countryMapping[countryName] || countryName;
  const feature = geoData.features.find(f => f.properties.admin === adminName);
  
  if (!feature) {
    console.warn(`Country ${countryName} not found in globe data`);
    return [];
  }
  
  return extractCoordinatesFromGeometry(feature.geometry);
};

const WorldMapHero: React.FC<WorldMapHeroProps> = ({
  title = "Connected Across Continents",
  ...props
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

  // Static locations for Lebanon, Argentina, United States, and Syria with detailed info
  const locations: CountryData[] = [
    { 
      lat: 33.82, 
      lng: 35.48, 
      label: "Lebanon",
      population: "150 Thousand",
      associations: ["Alawite Islamic Charity Association"]
    },
    { 
      lat: -34.6118, 
      lng: -63.3960, 
      label: "Argentina",
      population: "180 Thousand", 
      associations: ["Asociacion La Union Alauita de Beneficencia", "Asociacion Civil y Cultural APAIB", "Asociacion Islamica Alauita de Beneficencia", "Mosque Maulana ALI RIDA"]
    },
    { 
      lat: 39.8283, 
      lng: -98.5795, 
      label: "United States",
      population: "Major Community",
      associations: ["Alawites Association of the United States"]
    },
    { 
      lat: 34.8149, 
      lng: 39.2765, 
      label: "Syria",
      population: "2-3 million",
      associations: ["Soon"]
    },
    { 
      lat: -20.2744, 
      lng: 133.7751, 
      label: "Australia",
      population: "43 Thousand",
      associations: ["Islamic Alawi Centre of Tasmania", "Alawi Islamic Social Centre", "Alawi Islamic Association of Victoria", "Al Sadiq College", "Muslim Alawi Youth Movement","Moslem Alawite Society"]
    },
    { 
      lat: 56.1304, 
      lng: -106.3468, 
      label: "Canada",
      population: "Major Community",
      associations: ["Alawi Islamic Culturals Assoc of Windsor", "Alawite Association in Canada"]
    },
    { 
      lat: 51.1657, 
      lng: 10.4515, 
      label: "Germany",
      population: "70 Thousand",
      associations: ["Avrupa Arap Alevileri Federasyonu", "Iassist the Alawite League in Europe"]
    },
    { 
      lat: 46.6034, 
      lng: 1.8883, 
      label: "France",
      population: "Major Community",
      associations: ["M.O.D. Moyen d'orient diversifié"]
    }, 
  ];

  const dotColor = "#0ea5e9";
  const highlightColor = "#f59e0b"; // Amber color for highlights

  // Function to generate dots based on actual country boundaries
  const generateCountryDots = (countryName: string, count: number = 100) => {
    const boundaryCoords = getCountryCoordinates(countryName);
    
    if (boundaryCoords.length === 0) {
      console.warn(`No boundary data found for ${countryName}`);
      return [];
    }
    
    const dots = [];
    
    // Calculate bounding box of the country
    const lngs = boundaryCoords.map(coord => coord[0]);
    const lats = boundaryCoords.map(coord => coord[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    
    // Function to check if point is inside polygon using ray casting
    const isPointInPolygon = (lat: number, lng: number): boolean => {
      let inside = false;
      for (let i = 0, j = boundaryCoords.length - 1; i < boundaryCoords.length; j = i++) {
        const xi = boundaryCoords[i][0], yi = boundaryCoords[i][1];
        const xj = boundaryCoords[j][0], yj = boundaryCoords[j][1];
        
        if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
      return inside;
    };
    
    // Generate random points within country boundaries
    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loop
    
    while (dots.length < count && attempts < maxAttempts) {
      const randomLng = minLng + Math.random() * (maxLng - minLng);
      const randomLat = minLat + Math.random() * (maxLat - minLat);
      
      if (isPointInPolygon(randomLat, randomLng)) {
        dots.push({ lat: randomLat, lng: randomLng });
      }
      attempts++;
    }
    
    // If we couldn't generate enough points inside the polygon, 
    // fill remaining with points near the boundary
    while (dots.length < count) {
      const randomIndex = Math.floor(Math.random() * boundaryCoords.length);
      const [lng, lat] = boundaryCoords[randomIndex];
      
      // Add small random offset
      const offsetLat = lat + (Math.random() - 0.5) * 0.5;
      const offsetLng = lng + (Math.random() - 0.5) * 0.5;
      
      dots.push({ lat: offsetLat, lng: offsetLng });
    }
    
    return dots;
  };

  // Generate country-based dots for each location using actual boundary data
  const countryRegions = locations.map((location, index) => ({
    ...location,
    nearbyDots: generateCountryDots(location.label),
    index
  }));

  return (
    <section className="w-full py-16 lg:px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our presence spans across continents.
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
                <stop offset="0%" stopColor={highlightColor} stopOpacity="1" />
                <stop offset="100%" stopColor={highlightColor} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Render main location dots */}
            {locations.map((location, i) => {
              const point = projectPoint(location.lat, location.lng);
              return (
                <g key={`location-${i}`}>
                  {/* Country region dots - hidden by default, shown on parent hover */}
                  {countryRegions[i].nearbyDots.map((dot, dotIndex) => {
                    const dotPoint = projectPoint(dot.lat, dot.lng);
                    return (
                      <circle
                        key={`nearby-${i}-${dotIndex}`}
                        cx={dotPoint.x}
                        cy={dotPoint.y}
                        r="2"
                        fill={highlightColor}
                        className="opacity-0 transition-opacity duration-300"
                        data-country={i}
                      />
                    );
                  })}
                  
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
                        // Show nearby dots for this country
                        const nearbyDots = document.querySelectorAll(`[data-country="${i}"]`);
                        nearbyDots.forEach(dot => {
                          (dot as SVGElement).style.opacity = '0.7';
                          if (dot.getAttribute('data-main') === 'true') {
                            (dot as SVGElement).setAttribute('r', '5');
                            (dot as SVGElement).setAttribute('fill', 'url(#highlight-gradient)');
                          }
                        });
                      }}
                      onMouseLeave={() => {
                        // Hide nearby dots for this country
                        const nearbyDots = document.querySelectorAll(`[data-country="${i}"]`);
                        nearbyDots.forEach(dot => {
                          if (dot.getAttribute('data-main') !== 'true') {
                            (dot as SVGElement).style.opacity = '0';
                          } else {
                            (dot as SVGElement).setAttribute('r', '4');
                            (dot as SVGElement).setAttribute('fill', 'url(#dot-gradient)');
                          }
                        });
                      }}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold leading-none">{location.label}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{location.population}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Partner Organizations</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {location.associations.map((org, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {org}
                            </Badge>
                          ))}
                        </div>
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
                            <span className="text-sm font-medium">Partner Organizations</span>
                          </div>
                          <div className="space-y-2">
                            {location.associations.map((org, index) => (
                              <Badge key={index} variant="outline" className="mr-2">
                                {org}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DrawerFooter>
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
            For a United Assembly of Alawites worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WorldMapHero;
