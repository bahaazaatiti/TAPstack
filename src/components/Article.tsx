import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { toast } from '@/components/ui/sonner'
import AuthorBox from './AuthorBox'
import { 
  Clock, 
  Calendar, 
  Download, 
  Share2, 
  User, 
  ExternalLink, 
  Twitter, 
  Linkedin, 
  Facebook, 
  FileText,
  Copy,
  BarChart3,
  BookOpen,
  Eye,
  Maximize
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
  const [readingProgress, setReadingProgress] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [selectedPdf, setSelectedPdf] = useState<string>('')
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)

  useEffect(() => {
    // Parse content and generate TOC
    const generateTableOfContents = () => {
      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      
      // Calculate word count
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
      
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
    
    // Auto-select first PDF if available
    if (pdfFiles.length > 0 && !selectedPdf) {
      setSelectedPdf(pdfFiles[0].url)
    }
    
    setMounted(true)
  }, [content, pdfFiles, selectedPdf])

  // Reading progress tracking
  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const articleElement = document.querySelector('.article-content')
      if (!articleElement) return

      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = (scrollTop / docHeight) * 100
      
      setReadingProgress(Math.min(Math.max(scrollProgress, 0), 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

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

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: currentUrl,
        })
        toast.success('Article shared successfully!')
      } catch (err) {
        // User cancelled the share
      }
    } else {
      // Fallback: copy to clipboard
      await handleCopyUrl()
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success('URL copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy URL')
    }
  }

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

  return (
    <>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 start-0 end-0 z-50 h-1 bg-muted">
        <Progress 
          value={readingProgress} 
          className="h-1 rounded-none border-none"
        />
      </div>

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
              <Breadcrumb className={`flex items-center justify-center ${featuredImage ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href={parentUrl} 
                      className={`${featuredImage ? 'hover:text-primary-foreground' : 'hover:text-foreground'} transition-colors`}
                    >
                      {parentTitle}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
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
            
            {/* Article Actions Bar */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy URL
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <Eye className="h-4 w-4 inline me-1" />
                {Math.ceil(readingProgress)}% read
              </div>
            </div>

            {/* PDF Viewer Section */}
            {pdfFiles.length > 0 && (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      PDF Viewer
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={selectedPdf} onValueChange={setSelectedPdf}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select a PDF to view" />
                        </SelectTrigger>
                        <SelectContent>
                          {pdfFiles.map((pdf, index) => (
                            <SelectItem key={index} value={pdf.url}>
                              {pdf.title} ({pdf.size})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedPdf && (
                        <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Maximize className="h-4 w-4" />
                              Fullscreen
                            </Button>
                          </DialogTrigger>
                          <DialogContent className=" max-h-[90vh] h-[90vh] p-0 sm:max-w-2xl">
                            <DialogHeader className="p-4 pb-2">
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {pdfFiles.find(pdf => pdf.url === selectedPdf)?.title || 'PDF Viewer'}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 p-4 pt-0">
                              <div className="w-full h-[calc(90vh-120px)] border rounded-lg overflow-hidden">
                                <iframe
                                  src={`${selectedPdf}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                                  className="w-full h-full border-0"
                                  title="PDF Viewer - Fullscreen"
                                  loading="lazy"
                                >
                                  <p className="p-4 text-center text-muted-foreground">
                                    Your browser does not support PDFs. 
                                    <a 
                                      href={selectedPdf} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline ms-1"
                                    >
                                      Download the PDF
                                    </a>
                                  </p>
                                </iframe>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {selectedPdf && (
                  <CardContent className="p-0">
                    <div className="w-full h-[600px] border rounded-b-lg overflow-hidden">
                      <iframe
                        src={`${selectedPdf}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                        className="w-full h-full border-0"
                        title="PDF Viewer"
                        loading="lazy"
                      >
                        <p className="p-4 text-center text-muted-foreground">
                          Your browser does not support PDFs. 
                          <a 
                            href={selectedPdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline ms-1"
                          >
                            Download the PDF
                          </a>
                        </p>
                      </iframe>
                    </div>
                  </CardContent>
                )}
                {!selectedPdf && pdfFiles.length > 0 && (
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select a PDF from the dropdown above to view it here</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Enhanced Article Metadata */}
            <Tabs defaultValue="author" className="w-full">
              <TabsList className="flex w-full">
                <TabsTrigger 
                  value="info" 
                  className="flex-1"
                >
                  Article Info
                </TabsTrigger>
                <TabsTrigger 
                  value="author" 
                  className="flex-1"
                >
                  Author
                </TabsTrigger>
                {pdfFiles.length > 0 && (
                  <TabsTrigger 
                    value="files" 
                    className="flex-1"
                  >
                    Files
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Article Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-start">Published</TableCell>
                          <TableCell className="text-start">{date}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-start">Reading Time</TableCell>
                          <TableCell className="text-start">{readTime} minutes</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-start">Word Count</TableCell>
                          <TableCell className="text-start">{wordCount.toLocaleString()} words</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-start">Category</TableCell>
                          <TableCell className="text-start">
                            <Badge variant="secondary">{category}</Badge>
                          </TableCell>
                        </TableRow>
                        {tags.length > 0 && (
                          <TableRow>
                            <TableCell className="font-medium text-start">Tags</TableCell>
                            <TableCell className="text-start">
                              <div className="flex flex-wrap gap-1">
                                {tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="author" className="space-y-4">
                {author && (
                  <AuthorBox 
                    author={author}
                    showbio={true}
                    showsocial={true}
                    customtitle="About the Author"
                  />
                )}
              </TabsContent>

              {pdfFiles.length > 0 && (
                <TabsContent value="files" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Available Downloads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pdfFiles.map((pdf, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-6 h-6 text-red-600" />
                              <div>
                                <div className="font-medium">{pdf.title}</div>
                                <div className="text-sm text-muted-foreground">{pdf.size}</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={pdf.url} download>
                                <Download className="w-4 h-4 me-1" />
                                Download
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {/* Article Content */}
            <article className="article-content">
              {/* Content will be inserted here by useEffect */}
            </article>

            {/* Enhanced Table of Contents for Mobile */}
            {tocItems.length > 0 && (
              <div className="xl:hidden">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Table of Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-1">
                      {tocItems.map((item) => (
                        <Button
                          key={item.id}
                          variant={activeTocItem === item.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleTocClick(item.id)}
                          className={`w-full justify-start text-sm transition-colors h-auto min-h-8 py-2 whitespace-normal text-start leading-relaxed ${
                            activeTocItem === item.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          style={{ paddingInlineStart: `${(item.level - 1) * 16 + 16}px` }}
                        >
                          <span className="break-words hyphens-auto">
                            {item.text}
                          </span>
                        </Button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Article
