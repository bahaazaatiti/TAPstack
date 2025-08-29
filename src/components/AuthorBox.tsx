import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  ExternalLink, 
  Twitter, 
  Linkedin, 
  Facebook 
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

interface AuthorBoxProps {
  author?: Author | null
  showbio?: boolean
  showsocial?: boolean
  customtitle?: string
  [key: string]: any
}

const AuthorBox: React.FC<AuthorBoxProps> = ({
  author,
  showbio = true,
  showsocial = true,
  customtitle
}) => {
  // Don't render if no author is selected
  if (!author) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Optional Custom Title */}
      {customtitle && (
        <h3 className="text-xl font-semibold mb-6">{customtitle}</h3>
      )}
      
      {/* Author Details Box */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2.5 mb-4">
            {/* Author Avatar */}
            <Avatar className="size-12 border">
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

          {/* Biography */}
          {showbio && author.bio && (
            <>
              <Separator className="mb-4" />
              <p className="mb-4">{author.bio}</p>
            </>
          )}

          {/* Social Links */}
          {showsocial && (author.website || author.twitter || author.linkedin || author.facebook) && (
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
        )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthorBox
