"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "./button";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      // Add a small delay to ensure DOM is ready
      setTimeout(() => checkScrollability(), 100);
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      
      if (isRTL()) {
        // In RTL, we need to normalize scroll position across browsers
        let normalizedScrollLeft = scrollLeft;
        
        // Firefox uses negative values, Chrome uses positive values starting from max
        if (scrollLeft < 0) {
          // Firefox: convert negative to positive
          normalizedScrollLeft = Math.abs(scrollLeft);
        } else if (scrollLeft > 0 && maxScrollLeft > 0) {
          // Chrome: scrollLeft starts at maxScrollLeft and goes down
          normalizedScrollLeft = maxScrollLeft - scrollLeft;
        }
        
        setCanScrollLeft(normalizedScrollLeft > 1);
        setCanScrollRight(normalizedScrollLeft < maxScrollLeft - 1);
      } else {
        // LTR: Standard behavior
        setCanScrollLeft(scrollLeft > 1);
        setCanScrollRight(scrollLeft < maxScrollLeft - 1);
      }
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  const isRTL = () => {
    return document.documentElement.dir === 'rtl' || document.body.classList.contains('rtl');
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      if (isRTL()) {
        // In RTL, scrolling "left" means showing next items (scroll positive)
        carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
      } else {
        // In LTR, scrolling left means showing previous items (scroll negative)
        carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      if (isRTL()) {
        // In RTL, scrolling "right" means showing previous items (scroll negative)
        carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
      } else {
        // In LTR, scrolling right means showing next items (scroll positive)
        carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
      }
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 288 : 512; 
      const gap = isMobile() ? 6 : 10;
      
      let targetPosition = (cardWidth + gap) * index;
      
      if (isRTL()) {
        // In RTL, we scroll from right to left, but the positioning calculation
        // should account for the total scrollable width
        const { scrollWidth, clientWidth } = carouselRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        
        // For RTL, we want to scroll to show the card at the specified index
        // The first card (index 0) should be at the rightmost position
        targetPosition = Math.max(0, maxScrollLeft - targetPosition);
      }
      
      carouselRef.current.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
      
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className={cn(
            "flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-8 [scrollbar-width:none] md:py-14"
          )}
          dir={isRTL() ? "rtl" : "ltr"}
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute end-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-s",
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row gap-6 ps-6 justify-start",
              // Remove max-width constraint for full-width carousel
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-5xl last:pe-[10%] md:last:pe-[20%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="me-10 flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative z-40"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            {isRTL() ? <IconArrowNarrowRight className="h-4 w-4" /> : <IconArrowNarrowLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="relative z-40"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            {isRTL() ? <IconArrowNarrowLeft className="h-4 w-4" /> : <IconArrowNarrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-50 mx-auto my-10 h-fit max-w-5xl rounded-lg bg-card p-4 font-sans md:p-10 border shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <motion.p
                    layoutId={layout ? `category-${card.title}` : undefined}
                    className="text-base font-medium text-muted-foreground"
                  >
                    {card.category}
                  </motion.p>
                  <motion.p
                    layoutId={layout ? `title-${card.title}` : undefined}
                    className="mt-4 text-2xl font-semibold text-foreground md:text-5xl"
                  >
                    {card.title}
                  </motion.p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="ms-4 flex-shrink-0"
                  onClick={handleClose}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-96 w-72 flex-col items-start justify-start overflow-hidden rounded-lg bg-muted md:h-[40rem] md:w-[32rem] border shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-start font-sans text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-start font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};