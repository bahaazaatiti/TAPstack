import React, { useEffect, useState } from 'react'

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
  siteTitle,
  currentUrl
}) => {
  const [mounted, setMounted] = useState(false)
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([])

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
        
        // Set ID if not exists
        if (!heading.id) {
          heading.id = id
        }
        
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
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          const activeLink = document.querySelector(`[data-toc-link="${id}"]`)
          
          if (activeLink) {
            // Remove active state from all links
            document.querySelectorAll('[data-toc-link]').forEach(link => {
              link.className = 'text-muted-foreground block text-sm font-medium leading-normal transition duration-300 hover:text-primary text-left'
            })
            
            // Add active state to current link
            activeLink.className += ' lg:bg-muted lg:!text-primary lg:rounded-md lg:p-2 lg:font-bold'
          }
        }
      })
    }, {
      rootMargin: '-20% 0px -20% 0px',
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
  }, [mounted, tocItems])

  const handleTocClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.pushState(null, null, `#${id}`)
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
                  <svg className="h-4 w-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{readTime} min read</span>
                </div>
                
                <div className={featuredImage ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}>•</div>
                
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
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
                <span className={`inline-flex items-center rounded-full backdrop-blur-sm px-3 py-1 text-sm font-medium border ${featuredImage 
                  ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30' 
                  : 'bg-primary/20 text-primary border-primary/30'
                }`}>
                  {category}
                </span>
                
                {/* Tags */}
                {tags.map((tag, index) => (
                  <span key={index} className={`inline-flex items-center rounded-full backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium border ${featuredImage
                    ? 'bg-primary-foreground/10 text-primary-foreground/90 border-primary-foreground/20'
                    : 'bg-primary/10 text-primary/90 border-primary/20'
                  }`}>
                    {tag}
                  </span>
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
            <div className="hidden xl:block bg-background top-20 flex-1 pb-10 xl:sticky xl:pb-0">
              <div className="text-xl font-medium leading-snug">Chapters</div>
              <nav className="flex flex-col gap-2 pl-2 pt-2">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    data-toc-link={item.id}
                    onClick={() => handleTocClick(item.id)}
                    className="text-muted-foreground block text-sm font-medium leading-normal transition duration-300 hover:text-primary text-left"
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {item.text}
                  </button>
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
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
            <article 
              className="article-content prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h1:first:mt-0 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:first:mt-0 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:first:mt-0 prose-p:mb-6 prose-p:leading-relaxed prose-p:last:mb-0 prose-strong:font-semibold prose-em:italic prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-img:rounded-lg prose-img:my-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* PDF Files Section */}
            {pdfFiles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Documents</h3>
                {pdfFiles.map((pdf, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"/>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM14 9h-1V4l5 5h-4z"/>
                        </svg>
                        <div>
                          <div className="font-medium">{pdf.title}</div>
                          <div className="text-sm text-muted-foreground">{pdf.size}</div>
                        </div>
                      </div>
                      <a 
                        href={pdf.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </a>
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
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
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
                    <a 
                      href={author.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
                      title="Website"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {author.twitter && (
                    <a 
                      href={`https://twitter.com/${author.twitter}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
                      title="Twitter/X"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}

                  {author.linkedin && (
                    <a 
                      href={author.linkedin}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
                      title="LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect width="4" height="12" x="2" y="9"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </a>
                  )}

                  {author.facebook && (
                    <a 
                      href={author.facebook}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
                      title="Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t">
              {/* Back to blog */}
              <a 
                href={parentUrl}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to {parentTitle}
              </a>
              
              {/* Share button */}
              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Article
