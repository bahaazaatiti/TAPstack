import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  User, 
  ExternalLink, 
  Twitter, 
  Linkedin, 
  Facebook,
  Mail,
  BookOpen,
  TrendingUp,
  Clock,
  Tag,
  FileText
} from 'lucide-react'

interface Article {
  title: string
  url: string
  date: string
  dateFormatted: string
  category: string
  description: string
  readTime: string
  featuredImage?: {
    url: string
    alt: string
  }
}

interface PublicationStats {
  totalArticles: number
  recentArticles: number
  categoriesCount: number
  averageReadTime: number
  firstPublication?: string
  lastPublication?: string
}

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
  email?: string
  expertise?: string[]
}

interface AuthorBoxProps {
  author?: Author | null
  showbio?: boolean
  showsocial?: boolean
  customtitle?: string
  articles?: Article[]
  publicationStats?: PublicationStats | null
  translations?: any
  [key: string]: any
}

const AuthorBox: React.FC<AuthorBoxProps> = (props) => {
  const {
    author,
    showbio = true,
    showsocial = true,
    customtitle,
    articles = [],
    publicationStats,
    translations = {}
  } = props;
  const [isMobile, setIsMobile] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Don't render if no author is selected
  if (!author) {
    return null
  }

  // Quick preview content for hover card
  const QuickPreview = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Avatar className="size-10">
          {author.avatar ? (
            <AvatarImage src={author.avatar.url} alt={author.avatar.alt} />
          ) : null}
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{author.name}</div>
          {author.position && (
            <div className="text-xs text-muted-foreground">{author.position}</div>
          )}
        </div>
      </div>
      
      {author.bio && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {typeof author.bio === 'string' 
            ? (author.bio.length > 120 ? `${author.bio.substring(0, 120)}...` : author.bio)
            : ''
          }
        </p>
      )}
      
      {author.expertise && author.expertise.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {author.expertise.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {typeof tag === 'string' ? tag : 'Tag'}
            </Badge>
          ))}
          {author.expertise.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{author.expertise.length - 3} more
            </Badge>
          )}
        </div>
      )}
      
      {publicationStats && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {publicationStats.totalArticles} {translations.articles || 'articles'}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {publicationStats.averageReadTime} {translations.min_avg || 'min avg'}
          </div>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        {isMobile ? (
          (translations.click_full_profile || 'Click for full profile →')
        ) : (
          <button
            onClick={() => setSheetOpen(true)}
            className="text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline"
            aria-label={translations.click_full_profile || 'Click for full profile'}
          >
            {translations.click_full_profile || 'Click for full profile →'}
          </button>
        )}
      </div>
    </div>
  )

  // Full profile content for sheet/drawer
  const FullProfile = () => {
    const content = (
      <div className={`space-y-8 ${isMobile ? 'px-0' : 'px-6 pr-4'}`}>
        {/* Header */}
        <div className="text-center space-y-4 pb-6 border-b">
          <Avatar className="size-20 mx-auto">
            {author.avatar ? (
              <AvatarImage src={author.avatar.url} alt={author.avatar.alt} />
            ) : null}
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{author.name}</h3>
            {(author.position || author.affiliation) && (
              <p className="text-muted-foreground">
                {author.position}
                {author.position && author.affiliation && ' at '}
                {author.affiliation}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {author.bio && (
          <div className="space-y-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {translations.about || 'About'}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {typeof author.bio === 'string' ? author.bio : ''}
            </p>
          </div>
        )}

        {/* Expertise */}
        {author.expertise && author.expertise.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {translations.expertise || 'Expertise'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {typeof tag === 'string' ? tag : 'Tag'}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Publication Stats */}
        {publicationStats && (
          <div className="space-y-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {translations.publication_stats || 'Publication Stats'}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {publicationStats.totalArticles}
                </div>
                <div className="text-muted-foreground">{translations.total_articles || 'Total Articles'}</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {publicationStats.recentArticles}
                </div>
                <div className="text-muted-foreground">{translations.recent_30d || 'Recent (30d)'}</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {publicationStats.categoriesCount}
                </div>
                <div className="text-muted-foreground">{translations.categories || 'Categories'}</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {publicationStats.averageReadTime}m
                </div>
                <div className="text-muted-foreground">{translations.avg_read_time || 'Avg Read Time'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Articles */}
        {articles && articles.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {translations.recent_articles || 'Recent Articles'} ({articles.length})
            </h4>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {articles.map((article, index) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-3">
                    {article.featuredImage && (
                      <img
                        src={article.featuredImage.url}
                        alt={article.featuredImage.alt}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h5 className="font-medium text-sm line-clamp-2">
                        <a 
                          href={article.url}
                          className="hover:text-primary transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.title}
                        </a>
                      </h5>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {typeof article.description === 'string' ? article.description : ''}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {typeof article.category === 'string' ? article.category : 'Article'}
                        </Badge>
                        <span>{typeof article.dateFormatted === 'string' ? article.dateFormatted : ''}</span>
                        <span>•</span>
                        <span>{typeof article.readTime === 'number' ? article.readTime : 0} {translations.min_read || 'min read'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {showsocial && (author.website || author.twitter || author.linkedin || author.facebook || author.email) && (
          <div>
            <h4 className="font-medium mb-3">{translations.connect || 'Connect'}</h4>
            <div className="flex flex-wrap gap-1">
              {author.email && (
                <Button asChild size="sm" variant="outline">
                  <a href={`mailto:${author.email}`} title={translations.email || 'Email'}>
                    <Mail className="w-4 h-4 mr-2" />
                    {translations.email || 'Email'}
                  </a>
                </Button>
              )}
              {author.website && (
                <Button asChild size="sm" variant="outline">
                  <a 
                    href={author.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.website || 'Website'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {translations.website || 'Website'}
                  </a>
                </Button>
              )}
              {author.twitter && (
                <Button asChild size="sm" variant="outline">
                  <a 
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.twitter || 'Twitter'}
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    {translations.twitter || 'Twitter'}
                  </a>
                </Button>
              )}
              {author.linkedin && (
                <Button asChild size="sm" variant="outline">
                  <a 
                    href={author.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.linkedin || 'LinkedIn'}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    {translations.linkedin || 'LinkedIn'}
                  </a>
                </Button>
              )}
              {author.facebook && (
                <Button asChild size="sm" variant="outline">
                  <a 
                    href={author.facebook}
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.facebook || 'Facebook'}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    {translations.facebook || 'Facebook'}
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );

    // Return with or without ScrollArea based on mobile/desktop
    return isMobile ? content : (
      <ScrollArea className="h-full max-h-[80vh]">
        {content}
      </ScrollArea>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Optional Custom Title */}
      {customtitle && (
        <h3 className="text-xl font-semibold mb-6">{customtitle}</h3>
      )}
      
      {/* Author Details Box */}
      <Card className="bg-muted">
        <CardContent>
          <div className="flex items-center gap-1 mb-4">
            {/* Author Avatar with Hover Card */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  {/* Avatar clickable on desktop to open the sheet; hover still shows preview */}
                  <button
                    onClick={() => { if (!isMobile) setSheetOpen(true) }}
                    className="p-0 bg-transparent border-0 cursor-pointer"
                    aria-label={translations.view_profile || 'View Profile'}
                    type="button"
                  >
                    <Avatar className="size-12 border hover:ring-2 hover:ring-primary/20 transition-all duration-200">
                      {author.avatar ? (
                        <AvatarImage 
                          src={author.avatar.url} 
                          alt={author.avatar.alt} 
                        />
                      ) : null}
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" side="top">
                <QuickPreview />
              </HoverCardContent>
            </HoverCard>
            
            {/* Author Info with Interactive Name */}
            <div className="flex-1">
              {isMobile ? (
                // Mobile: Use Drawer
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="text-start hover:text-primary transition-colors">
                      <div className="text-sm font-medium leading-normal">{author.name}</div>
                      {(author.position || author.affiliation) && (
                        <div className="text-muted-foreground text-sm font-normal leading-normal">
                          {author.position}
                          {author.position && author.affiliation && ' & '}
                          {author.affiliation}
                        </div>
                      )}
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{translations.author_profile || 'Author Profile'}</DrawerTitle>
                      <DrawerDescription>
                        {translations.detailed_info_about || 'Detailed information about'} {author.name}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
                      <FullProfile />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">{translations.close || 'Close'}</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              ) : (
                // Desktop: show name as button that opens the shared sheet
                <button
                  onClick={() => setSheetOpen(true)}
                  className="text-start hover:text-primary transition-colors"
                  type="button"
                >
                  <div className="text-sm font-medium leading-normal">{author.name}</div>
                  {(author.position || author.affiliation) && (
                    <div className="text-muted-foreground text-sm font-normal leading-normal">
                      {author.position}
                      {author.position && author.affiliation && ' & '}
                      {author.affiliation}
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Quick Stats Display */}
            {publicationStats && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{translations.publications || 'Publications'}</div>
                <div className="text-lg font-semibold text-primary">
                  {publicationStats.totalArticles}
                </div>
              </div>
            )}
          </div>

          {/* Biography */}
          {showbio && author.bio && (
            <>
              <Separator className="mb-4" />
              <p className="mb-4">{author.bio}</p>
            </>
          )}

          {/* Expertise Tags */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {author.expertise.slice(0, 5).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {typeof tag === 'string' ? tag : 'Tag'}
                  </Badge>
                ))}
                {author.expertise.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{author.expertise.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Social Links and View Profile Button */}
          {showsocial && (author.website || author.twitter || author.linkedin || author.facebook) && (
            <div className="flex items-center gap-1">
              {author.website && (
                <Button asChild size="icon" variant="ghost">
                  <a 
                    href={author.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.website || 'Website'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}

              {author.twitter && (
                <Button asChild size="icon" variant="ghost">
                  <a 
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.twitter || 'Twitter'}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}

              {author.linkedin && (
                <Button asChild size="icon" variant="ghost">
                  <a 
                    href={author.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.linkedin || 'LinkedIn'}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}

              {author.facebook && (
                <Button asChild size="icon" variant="ghost">
                  <a 
                    href={author.facebook}
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={translations.facebook || 'Facebook'}
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
              )}

              {/* View Full Profile Button */}
              {isMobile ? (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button size="sm" variant="outline" className="ml-auto">
                      <User className="w-4 h-4 mr-2" />
                      {translations.view_profile || 'View Profile'}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{translations.author_profile || 'Author Profile'}</DrawerTitle>
                      <DrawerDescription>
                        {translations.detailed_info_about || 'Detailed information about'} {author.name}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
                      <FullProfile />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">{translations.close || 'Close'}</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="sm" variant="outline" className="me-auto">
                      <User className="w-4 h-4 mr-2" />
                      {translations.view_profile || 'View Profile'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>{translations.author_profile || 'Author Profile'}</SheetTitle>
                      <SheetDescription>
                        {translations.detailed_info_about || 'Detailed information about'} {author.name}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FullProfile />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Shared Sheet for desktop full profile (controlled) */}
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{translations.author_profile || 'Author Profile'}</SheetTitle>
              <SheetDescription>
                {translations.detailed_info_about || 'Detailed information about'} {author.name}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FullProfile />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default AuthorBox
