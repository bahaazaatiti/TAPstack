import * as React from "react"
import {
  SearchIcon,
  FileTextIcon,
  HomeIcon,
  ArrowUpRightIcon,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface SiteSearchProps {
  sitepages?: Array<{
    title: string
    url: string
    slug: string
    isActive: boolean
  }>
  currentLanguage?: string
  defaultLanguage?: string
}

export default function SiteSearch({ 
  sitepages = [], 
  currentLanguage,
  defaultLanguage = 'en'
}: SiteSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Detect current language from URL if not provided 
  // TODO: PLEASE FIX THIS FIND BETTER SOLUTION THAN THIS
  const detectCurrentLanguage = React.useCallback(() => {
    if (currentLanguage) return currentLanguage
    
    const path = window.location.pathname
    const langCode = path.split('/')[1]
    
    // Simple language detection - if first path segment looks like a language code
    if (langCode && langCode.length === 2 && langCode !== 'en') {
      return langCode
    }
    
    return defaultLanguage
  }, [currentLanguage, defaultLanguage])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Filter pages based on search query
  const filteredPages = sitepages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePageSelect = (url: string) => {
    setOpen(false)
    window.location.href = url
  }

  const handleSearchPage = () => {
    setOpen(false)
    
    // Get current language
    const lang = detectCurrentLanguage()
    
    // Navigate to search page with language prefix if not default language
    let searchUrl = ''
    if (lang !== defaultLanguage) {
      searchUrl = `/${lang}/search`
    } else {
      searchUrl = '/search'
    }
    
    // Add query parameter if search query exists
    if (searchQuery) {
      searchUrl += `?q=${encodeURIComponent(searchQuery)}`
    }
    
    window.location.href = searchUrl
  }

  return (
    <>
      <button
        className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-8 w-fit rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={() => setOpen(true)}
        aria-label="Search site"
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-2"
            size={14}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal hidden sm:inline">Search</span>
        </span>
        <kbd className="bg-background text-muted-foreground/70 ms-2 -me-1 hidden md:inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search pages and content..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <span>No results found.</span>
              {searchQuery && (
                <button
                  onClick={handleSearchPage}
                  className="text-primary hover:text-primary/80 text-sm underline"
                >
                  Search all content for "{searchQuery}"
                </button>
              )}
            </div>
          </CommandEmpty>
          
          {searchQuery && (
            <>
              <CommandGroup heading="Search All Content">
                <CommandItem onSelect={handleSearchPage}>
                  <SearchIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Search for "{searchQuery}"</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {filteredPages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredPages.map((page, index) => (
                <CommandItem 
                  key={index}
                  onSelect={() => handlePageSelect(page.url)}
                >
                  <HomeIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>{page.title}</span>
                  <ArrowUpRightIcon
                    size={12}
                    className="opacity-40 ml-auto"
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!searchQuery && sitepages.length > 0 && (
            <CommandGroup heading="Navigation">
              {sitepages.slice(0, 5).map((page, index) => (
                <CommandItem 
                  key={index}
                  onSelect={() => handlePageSelect(page.url)}
                >
                  <HomeIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>{page.title}</span>
                  <ArrowUpRightIcon
                    size={12}
                    className="opacity-40 ml-auto"
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
