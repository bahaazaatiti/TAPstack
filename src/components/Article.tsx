import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Calendar, 
  Download, 
  Share2, 
  ArrowLeft, 
  User, 
  ExternalLink, 
  Twitter, 
  Linkedin, 
  Facebook, 
  FileText 
} from 'lucide-react'

interface Author {
  name: string
  position?: string
  affiliation?: string
  bio?: string
  avatar?: {
    url: string
    alt: string
  }
  website?: string
  twitter?: string
  linkedin?: string
  facebook?: string
}

interface ArticleProps {
  // Hero section data
  title: string
  description?: string
  category: string
  tags: string[]
  readTime: number
  date: string
  parentTitle: string
  parentUrl: string
  featuredImage?: {
    url: string
    alt: string
  }

  // Content
  content: string
  author?: Author

  // PDF files
  pdfFiles: Array<{
    url: string
    title: string
    size: string
  }>

  // Site data
  siteTitle: string
  currentUrl: string
}

const Article: React.FC<ArticleProps> = ({
  title,
  description,
  category,
  tags,
  readTime,
  date,
  parentTitle,
  parentUrl,
  featuredImage,
  content,
  author,
  pdfFiles,
  currentUrl
}) => {
  const [mounted, setMounted] = useState(false)
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [activeTocItem, setActiveTocItem] = useState<string>('')
  const [isScrollingToSection, setIsScrollingToSection] = useState(false)

  useEffect(() => {
    // Parse content and generate TOC
    const generateTableOfContents = () => {
      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const tocData: Array<{ id: string; text: string; level: number }> = []
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent || ''
        const id = heading.id || `heading-${index + 1}`
        
        // Set ID if not exists and add scroll margin class
        if (!heading.id) {
          heading.id = id
        }
        heading.className = `${heading.className} scroll-mt-24`
        
        tocData.push({ id, text, level })
      })
      
      setTocItems(tocData)
      
      // Update the content with IDs after a short delay to ensure DOM is ready
      setTimeout(() => {
        const contentContainer = document.querySelector('.article-content')
        if (contentContainer) {
          contentContainer.innerHTML = tempDiv.innerHTML
        }
      }, 100)
    }

    generateTableOfContents()
    setMounted(true)
  }, [content])

  // Separate useEffect for intersection observer
  useEffect(() => {
    if (!mounted || tocItems.length === 0) return

    const observer = new IntersectionObserver((entries) => {
      // Only update if we're not manually scrolling to a section
      if (isScrollingToSection) return
      
      // Find the first intersecting entry (topmost visible heading)
      const intersectingEntry = entries.find(entry => entry.isIntersecting)
      
      if (intersectingEntry) {
        setActiveTocItem(intersectingEntry.target.id)
      }
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    })
    
    // Observe headings after a delay to ensure they're in the DOM
    setTimeout(() => {
      tocItems.forEach(item => {
        const element = document.getElementById(item.id)
        if (element) observer.observe(element)
      })
    }, 200)
    
    return () => observer.disconnect()
  }, [mounted, tocItems, isScrollingToSection])

  const handleTocClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      setIsScrollingToSection(true)
      setActiveTocItem(id) // Immediately set the active item
      
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState({}, '', `#${id}`)
      
      // Reset the scrolling flag after scrolling is likely complete
      setTimeout(() => {
        setIsScrollingToSection(false)
      }, 1000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: currentUrl,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentUrl)
      // You could show a toast notification here
      alert('Link copied to clipboard!')
    }
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        {/* Background Image or Fallback */}
        <div className="absolute inset-0">
          {featuredImage ? (
            <>
              <img
                src={featuredImage.url}
                alt={featuredImage.alt}
                className="h-full w-full object-cover"
              />
              {/* Gradient Overlay for Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </>
          ) : (
            <>
              {/* Fallback Background when no featured image */}
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background"></div>
              {/* Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/20"></div>
            </>
          )}
        </div>
        
        {/* Hero Content */}
        <div className="relative flex h-full items-center justify-center py-8 md:py-16 lg:py-20">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
            <div className={`max-w-4xl mx-auto space-y-3 md:space-y-4 lg:space-y-6 ${featuredImage ? 'text-primary-foreground' : 'text-foreground'} text-center drop-shadow-lg`}>
              {/* Breadcrumb */}
              <nav className={`flex items-center justify-center gap-2 text-sm ${featuredImage ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                <a href={parentUrl} className={`${featuredImage ? 'hover:text-primary-foreground' : 'hover:text-foreground'} transition-colors`}>
                  {parentTitle}
                </a>
              </nav>
              
              {/* Meta Information */}
              <div className={`flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm ${featuredImage ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 drop-shadow-md" />
                  <span>{readTime} min read</span>
                </div>
                
                <div className={featuredImage ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}>•</div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 drop-shadow-md" />
                  <time>{date}</time>
                </div>
              </div>
              
              {/* Title */}
              <h1 className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight leading-tight ${featuredImage ? 'text-primary-foreground' : 'text-foreground'} drop-shadow-xl px-4`}>
                {title}
              </h1>
              
              {/* Description */}
              {description && (
                <div className="pt-4 md:pt-6">
                  <p className={`text-base md:text-lg lg:text-xl ${featuredImage ? 'text-primary-foreground/90' : 'text-muted-foreground'} leading-relaxed max-w-3xl mx-auto px-4`}>
                    {description}
                  </p>
                </div>
              )}
              
              {/* Category and Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pt-4">
                {/* Category Badge */}
                <Badge
                  variant={featuredImage ? "outline" : "default"}
                  className={`backdrop-blur-sm ${featuredImage 
                    ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30' 
                    : 'bg-primary/20 text-primary border-primary/30'
                  }`}
                >
                  {category}
                </Badge>
                
                {/* Tags */}
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`backdrop-blur-sm ${featuredImage
                      ? 'bg-primary-foreground/10 text-primary-foreground/90 border-primary-foreground/20'
                      : 'bg-primary/10 text-primary/90 border-primary/20'
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container pt-20 px-4 md:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-5xl items-start justify-between gap-20 xl:flex">
          
          {/* Table of Contents Sidebar (Desktop Only) */}
          {tocItems.length > 0 && (
            <div className="hidden xl:block bg-background top-20 w-64 shrink-0 pb-10 xl:sticky xl:pb-0">
              <div className="text-xl font-medium leading-snug">Chapters</div>
              <nav className="flex flex-col gap-2 ps-2 pt-2">
                {tocItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTocItem === item.id ? "default" : "ghost"}
                    size="sm"
                    data-toc-link={item.id}
                    onClick={() => handleTocClick(item.id)}
                    className={`justify-start text-sm font-medium leading-normal transition duration-300 whitespace-normal text-start h-auto min-h-8 ${
                      activeTocItem === item.id 
                        ? 'bg-muted !text-primary font-bold' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    style={{ paddingInlineStart: `${(item.level - 1) * 12 + 12}px` }}
                  >
                    {item.text}
                  </Button>
                ))}
              </nav>
            </div>
          )}
          
          {/* Content Area */}
          <div className="flex w-full xl:max-w-[40rem] max-w-4xl mx-auto flex-col gap-10">
            
            {/* Author Info at Top */}
            {author && (
              <div className="flex items-center gap-2.5">
                {/* Author Avatar */}
                {author.avatar ? (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full size-12 border">
                    <img
                      src={author.avatar.url}
                      alt={author.avatar.alt}
                      className="aspect-square size-full"
                    />
                  </span>
                ) : (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full size-12 border bg-primary/10 items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </span>
                )}
                
                {/* Author Info */}
                <div>
                  <div className="text-sm font-medium leading-normal">{author.name}</div>
                  {(author.position || author.affiliation) && (
                    <div className="text-muted-foreground text-sm font-normal leading-normal">
                      {author.position}
                      {author.position && author.affiliation && ' & '}
                      {author.affiliation}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Article Content */}
            <article className="article-content">
              {/* Content will be inserted here by useEffect */}
            </article>

            {/* PDF Files Section */}
            {pdfFiles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Documents</h3>
                {pdfFiles.map((pdf, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-red-600" />
                        <div>
                          <div className="font-medium">{pdf.title}</div>
                          <div className="text-sm text-muted-foreground">{pdf.size}</div>
                        </div>
                      </div>
                      <Button asChild>
                        <a 
                          href={pdf.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                    
                    {/* PDF Embed */}
                    <div className="w-full h-96 border rounded bg-white">
                      <embed 
                        src={`${pdf.url}#toolbar=1&navpanes=1&scrollbar=1`}
                        type="application/pdf" 
                        width="100%" 
                        height="100%"
                        className="rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Author Details Box at Bottom */}
            {author && (
              <div className="bg-muted rounded-lg p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  {/* Author Avatar */}
                  {author.avatar ? (
                    <span className="relative flex shrink-0 overflow-hidden rounded-full size-12 border">
                      <img
                        src={author.avatar.url}
                        alt={author.avatar.alt}
                        className="aspect-square size-full"
                      />
                    </span>
                  ) : (
                    <span className="relative flex shrink-0 overflow-hidden rounded-full size-12 border bg-primary/10 items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </span>
                  )}
                  
                  {/* Author Info */}
                  <div>
                    <div className="text-sm font-medium leading-normal">{author.name}</div>
                    {(author.position || author.affiliation) && (
                      <div className="text-muted-foreground text-sm font-normal leading-normal">
                        {author.position}
                        {author.position && author.affiliation && ' & '}
                        {author.affiliation}
                      </div>
                    )}
                  </div>
                </div>

                {author.bio && (
                  <p className="mb-4">{author.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-2.5">
                  {author.website && (
                    <Button asChild size="icon">
                      <a 
                        href={author.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {author.twitter && (
                    <Button asChild size="icon">
                      <a 
                        href={`https://twitter.com/${author.twitter}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Twitter/X"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {author.linkedin && (
                    <Button asChild size="icon">
                      <a 
                        href={author.linkedin}
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {author.facebook && (
                    <Button asChild size="icon">
                      <a 
                        href={author.facebook}
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Facebook"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t">
              {/* Back to blog */}
              <Button asChild variant="ghost">
                <a href={parentUrl}>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  Back to {parentTitle}
                </a>
              </Button>
              
              {/* Share button */}
              <Button onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Article
