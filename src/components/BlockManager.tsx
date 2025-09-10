import React, { useEffect, ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
// TODO: change this to a dynamic import if needed
import WavyHero from './WavyHero'
import Comp582 from './Comp582'
import FooterSection from './default'
import Blog from './Blog'
import LatestBlog from './latestblog'
import FeaturedBlog from './featuredblog'
import BentoGridBlock from './BentoGridBlock'
import TextBlock from './textblock'
import Features03 from './Features03'
import AppleCarousel from './AppleCarousel'
import Article from './Article'
import AuthorBox from './AuthorBox'
import WorldMapHero from './WorldMapHero'

// Block registry - add new blocks here
const blockComponents: Record<string, ComponentType<any>> = {
  wavyhero: WavyHero,
  comp582: Comp582,
  blog: Blog,
  latestblog: LatestBlog,
  featuredblog: FeaturedBlog,
  bentogrid: BentoGridBlock,
  applecarousel: AppleCarousel,
  textblock: TextBlock,
  features03: Features03,
  footer: FooterSection,
  article: Article,
  authorbox: AuthorBox,
  worldmaphero: WorldMapHero,
  // Add more blocks here as you create them
  // TODO: Consider using dynamic imports for better performance
}

const BlockManager: React.FC = () => {
  useEffect(() => {
    mountBlocks()
    
    // Watch for new blocks added dynamically
    const observer = new MutationObserver(() => {
      mountBlocks()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  const mountBlocks = () => {
    // Process all registered block types
    Object.keys(blockComponents).forEach(blockType => {
      mountBlockType(blockType)
    })
  }

  const mountBlockType = (blockType: string) => {
    // Get all containers for this block type that haven't been mounted yet
    const containers = document.querySelectorAll(`.${blockType}-container:not([data-react-mounted])`)
    
    containers.forEach(container => {
      const blockId = container.id
      const data = (window as any).blockData && (window as any).blockData[blockId]
      
      if (data && blockComponents[blockType]) {
        // Create a new React root for this block
        const root = createRoot(container)
        const BlockComponent = blockComponents[blockType]
        
        root.render(<BlockComponent {...data} />)
        container.setAttribute('data-react-mounted', 'true')
        
        console.log(`Mounted ${blockType} block:`, blockId)
      }
    })
  }

  return null
}

export default BlockManager
