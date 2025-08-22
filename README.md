# TAPstack

A hybrid content management system that integrates Kirby CMS with React components through a block-based architecture. The system provides server-side content management with client-side interactive components.

## Architecture

TAPstack implements a hybrid architecture combining Kirby CMS for content management with React for interactive frontend components. The integration uses a custom block system that bridges PHP server-side rendering with client-side React component mounting.

### Core Components

```
Backend:       Kirby CMS 5.x + PHP 8.3
Frontend:      React 19 + TypeScript + Tailwind CSS 4
Build System:  Vite 7 + kirby-vite plugin
Integration:   Block system + pass-block-data utility
```

## Features

### Content Management
- Visual block editor in Kirby Panel
- Real-time content editing with live preview
- Flexible page layouts using block composition
- Built-in revision history and draft management

### Block System
- Automatic serialization from PHP to React props
- Type-safe component interfaces with TypeScript
- Dynamic React component mounting via MutationObserver
- Hot module replacement for both PHP templates and React components

### Interactive Components
- 3D globe visualization using Three.js
- Responsive navigation with mobile support
- Theme management with dark/light/system modes
- Multi-language support with RTL layout handling

### Development Environment
- Sub-second hot reload during development
- Component library integration with shadcn/ui
- Tailwind CSS 4 with OKLCH color system
- End-to-end TypeScript coverage

## Requirements

- PHP 8.2, 8.3, or 8.4
- Node.js 18+ with npm
- Composer 2.x
- Modern browser with ES2020 support

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/TAPstack.git
cd TAPstack

# Install PHP dependencies
composer install

# Install Node.js dependencies  
npm install
```

### Development Server

Start the development environment:

```bash
npm run dev
```

This launches two concurrent processes:
- PHP development server on localhost:8888 (Kirby CMS)
- Vite development server on localhost:5173 (React HMR + assets)

The servers provide hot module replacement for React components and automatic reloading for PHP template changes.

## Block System

### Data Flow

```
Kirby Panel -> Block Configuration -> PHP Snippet -> pass-block-data.php -> window.blockData -> BlockManager.tsx -> React Component
```

### Block Lifecycle

1. Content creation: Editors create blocks using YAML blueprints in Kirby Panel
2. Server processing: PHP snippets render DOM containers and prepare data structures  
3. Data injection: pass-block-data.php utility serializes all fields to JavaScript
4. Client mounting: BlockManager.tsx detects containers and mounts React components
5. Interactive rendering: React components receive all data as props

### Block Structure

Each block consists of four files:

```
site/plugins/custom/{blockname}/
├── index.php                           # Kirby plugin registration
├── blueprints/blocks/{blockname}.yml   # Admin interface definition  
└── snippets/blocks/{blockname}.php     # Server-side template

src/components/{BlockName}.tsx           # React component implementation
```

### Block Data Utility

The pass-block-data.php snippet handles automatic data serialization for all blocks:

```php
<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'hero']) ?>
```

Features:
- Smart field processing for structure fields, file fields, and complex data types
- Intelligent file UUID resolution with multiple fallback strategies  
- Site context injection (navigation, languages, current page)
- Type conversion from Kirby field types to JavaScript-compatible formats
- Debug logging for development troubleshooting

### React Component Integration

Components receive all block fields as props with TypeScript support:

```typescript
interface HeroProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonUrl?: string
  buttonExternal?: boolean
  style?: 'default' | 'dark' | 'light'
  [key: string]: any
}

const Hero: React.FC<HeroProps> = ({
  title = 'Default Title',
  subtitle = 'Default subtitle',
  style = 'default',
  ...otherProps
}) => {
  // Component implementation
}
```

## Available Blocks

### Navigation and Layout

#### comp582 - Header Component
- Multi-language support with dynamic language switching
- Theme integration with dark/light/system toggle
- Responsive design with mobile navigation
- Configurable user menu integration
- Logo support for image and text combinations

#### navbar/navbar04 - Navigation Variants  
- Internal/external link handling with target control
- Mobile menu with smooth animations
- Style variants (default, dark, light)

#### hero - Landing Page Sections
- Call-to-action buttons with external link support
- Background style variants (gradient, dark, light)
- Responsive typography scaling

#### footer - Site Footer
- Multi-column layout configuration
- Policy links integration
- Dynamic copyright management

### Content and Blog

#### blog - Blog System
- Article listing with pagination and metadata
- Category sidebar with dynamic filtering and post counts
- Featured image processing and optimization
- Article metadata display (author, date, read time, tags)

#### latestblog - Latest Articles Grid
- Displays 8 most recent articles
- Responsive grid layout (1-4 columns)
- Configurable call-to-action button

#### featuredblog - Featured Content
- Curated article selection
- Large format article presentation

#### blogglobe - 3D Geographic Visualization
- Three.js-powered 3D earth visualization  
- Article mapping by geographic coordinates
- Category-based color coding for article dots
- Dynamic statistics display
- Auto-rotating globe with user controls

#### textblock - Simple Text Content
- Icon, subtitle, title, and description fields
- Read more/less functionality for long content
- Primary color accent styling

#### features03 - Design & Engage Features
- Two-column responsive feature cards layout
- Configurable icons from Lucide icon library
- Dynamic feature lists with icon + text pairs
- Call-to-action buttons with external link support
- Mobile-responsive with placeholder media areas

## Creating Custom Blocks

### 1. Directory Structure

Create the plugin directory structure:

```bash
mkdir -p site/plugins/custom/{blockname}/{blueprints/blocks,snippets/blocks}
```

### 2. Plugin Registration

```php
<?php
// site/plugins/custom/{blockname}/index.php

Kirby::plugin('project/{blockname}-block', [
  'blueprints' => [
    'blocks/{blockname}' => __DIR__ . '/blueprints/blocks/{blockname}.yml'
  ],
  'snippets' => [
    'blocks/{blockname}' => __DIR__ . '/snippets/blocks/{blockname}.php'
  ]
]);
```

### 3. Block Blueprint

```yaml
# site/plugins/custom/{blockname}/blueprints/blocks/{blockname}.yml
name: Block Display Name
icon: lucide-icon-name
fields:
  title:
    label: Title
    type: text
    required: true
    placeholder: Enter title here
  description:
    label: Description  
    type: textarea
    help: Brief description of the content
  style:
    label: Style Variant
    type: select
    options:
      default: Default
      primary: Primary Theme
      secondary: Secondary Theme
    default: default
```

### 4. PHP Snippet

```php
<?php 
// site/plugins/custom/{blockname}/snippets/blocks/{blockname}.php
?>

<div id="{blockname}-<?= $block->id() ?>" class="{blockname}-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => '{blockname}']) ?>
```

### 5. React Component

```typescript
// src/components/{BlockName}.tsx
import React from 'react'

interface {BlockName}Props {
  title?: string
  description?: string
  style?: 'default' | 'primary' | 'secondary'
  [key: string]: any
}

const {BlockName}: React.FC<{BlockName}Props> = ({
  title = 'Default Title',
  description = 'Default description',
  style = 'default',
  ...props
}) => {
  const getStyleClasses = () => {
    const baseClasses = 'block-container p-6 rounded-lg'
    const variants = {
      default: 'bg-background text-foreground',
      primary: 'bg-primary text-primary-foreground', 
      secondary: 'bg-secondary text-secondary-foreground'
    }
    return `${baseClasses} ${variants[style]}`
  }

  return (
    <section className={getStyleClasses()}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </section>
  )
}

export default {BlockName}
```

### 6. Component Registration

```typescript
// src/components/BlockManager.tsx
import {BlockName} from './{BlockName}'

const blockComponents: Record<string, ComponentType<any>> = {
  // ...existing blocks...
  {blockname}: {BlockName},
}
```

### 7. Page Blueprint Integration

```yaml
# site/blueprints/pages/blocks.yml  
fields:
  blocks:
    type: blocks
    fieldsets:
      - navbar
      - hero  
      - {blockname}
```

## Configuration

### Development Commands

```bash
# Start full development environment  
npm run dev      # PHP server + Vite HMR (recommended)

# Individual servers
npm run server   # PHP development server only (localhost:8888)
npm run vite     # Vite development server only (localhost:5173)
```

### Production Build

```bash
# Build optimized production assets
npm run build    # Outputs to public/dist with file hashing

# Build and preview production locally  
npm run preview  # Build + serve with PHP server
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  root: 'src',
  base: mode === 'development' ? '/' : '/dist/',
  
  build: {
    outDir: path.resolve(process.cwd(), 'public/dist'),
    emptyOutDir: true,
    rollupOptions: { 
      input: path.resolve(process.cwd(), 'src/index.tsx') 
    }
  },

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },

  plugins: [
    react(),           // React Fast Refresh
    tailwindcss(),     // Tailwind CSS 4  
    kirby()           // Kirby-Vite integration
  ]
}))
```

### Kirby Configuration

```php
<?php
// site/config/config.localhost.php  
return [
  'debug' => true,  // Enable debug mode for development
];
```

### TypeScript Configuration

```jsonc
// tsconfig.json
{
  "references": [
    { "path": "./tsconfig.app.json" },    // Application code
    { "path": "./tsconfig.node.json" }    // Build tools
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }       // Path mapping
  }
}
```

## Styling

### Tailwind CSS 4

```css
/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* OKLCH color system */
  --color-primary: var(--primary);
  --color-background: var(--background);
  /* Custom radius system */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-lg: var(--radius);
}
```

Features:
- OKLCH color system for consistent colors across devices
- Dark mode with system preference detection
- Mobile-first responsive design
- CSS custom properties for theming

### Component Library

shadcn/ui components with consistent styling:

```typescript
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"  
import { ThemeToggle } from "@/components/ui/theme-toggle"
```

Available components include navigation menus, buttons, forms, popovers, dropdowns, dialogs, theme toggle, and responsive layout components.

### Theme Management

Global theme system with localStorage persistence:

```typescript
// Automatic system preference detection
const themeManager = new ThemeManager()

// Manual theme switching
themeManager.setTheme('dark' | 'light' | 'system')

// React component integration
<ThemeToggle />
```

## Internationalization

### Multi-language Support

```php
<?php
// site/languages/en.php
return [
  'code' => 'en',
  'default' => true,
  'direction' => 'ltr',
  'name' => 'English'
];

// site/languages/ar.php  
return [
  'code' => 'ar',
  'direction' => 'rtl',
  'name' => 'العربية'
];
```

### RTL Support

```css
/* Automatic RTL layout support */
body.rtl {
  direction: rtl !important;
}

.rtl [data-slot="navigation-menu"] {
  direction: inherit !important;
}
```

Features:
- Automatic URL routing with language prefixes (/en/page, /ar/page)
- Context-aware language selector with current language detection
- Complete right-to-left layout for Arabic
- Automatic language switching preserves current page

## Performance

### Development
- Sub-second hot module replacement with React Fast Refresh
- Smart reloading: kirby-vite watches PHP templates for full-page reloads
- Intelligent mounting: MutationObserver detects dynamic content changes
- Code splitting: automatic bundle optimization with Vite

### Production
- Asset optimization: minification, compression, and file hashing
- CSS purging: Tailwind removes unused styles automatically
- Bundle analysis: built-in code splitting for optimal loading
- CDN ready: hashed filenames for effective caching strategies

### State Management
- Server-driven state: data flows from Kirby through props
- Component isolation: each block manages its own local state
- Persistent preferences: theme and language stored in localStorage
- URL state: navigation and language state managed through URLs

## Development Notes

### Hot Module Replacement

React Fast Refresh provides instant component updates during development. The kirby-vite plugin watches PHP templates, snippets, and content files for full-page reloads when server-side code changes.

### Block Component Best Practices

```typescript
// Use destructuring with defaults
const MyBlock: React.FC<Props> = ({
  title = 'Default Title',
  style = 'default',
  ...props
}) => {
  // Implementation
}

// Handle optional complex data
const imageData = featuredImage?.url ? featuredImage : null

// Type-safe style handling  
const variants = {
  default: 'bg-white',
  dark: 'bg-gray-900'
} as const
```

### Debugging

```php
<?php
// Enable detailed logging in development
error_log("Block data: " . json_encode($blockData));
?>

<script>
// Client-side block data inspection
console.log('Block data:', window.blockData);
</script>
```

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Assets are built to public/dist/ with file hashing for cache busting, code splitting for optimized bundle sizes, and minified CSS/JS with compression.

### Server Requirements

#### Minimum Requirements
- Web server: Apache 2.4+ or Nginx 1.18+
- PHP 8.2+ with required extensions
- URL rewriting for Kirby's clean URLs
- File permissions: write access to content and storage directories

#### Apache Configuration
```apache
# .htaccess
RewriteEngine On
RewriteRule ^media/pages/(.*)/(.*) media/pages/$1/$2 [L]
RewriteRule ^content/(.*) error [R=404,L]
RewriteRule ^site/(.*) error [R=404,L]
RewriteRule ^kirby/(.*) error [R=404,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*) index.php [L]
```

### Environment Configuration

```php
<?php
// site/config/config.php (production)
return [
  'debug' => false,
  'cache' => [
    'pages' => [
      'active' => true,
      'ignore' => fn ($page) => $page->kirby()->user() !== null
    ]
  ]
];
```

### Deployment Strategies

#### Git Deployment
```bash
# On server
git clone https://github.com/yourusername/TAPstack.git
cd TAPstack
composer install --no-dev --optimize-autoloader
npm ci && npm run build
```

#### Rsync Deployment  
```bash
# Sync to server (exclude development files)
rsync -avz --exclude node_modules --exclude .git \
  --exclude src --exclude .env \
  ./ user@server:/path/to/site/
```

## Troubleshooting

### Block Not Mounting

Symptoms: React component doesn't appear, no console errors

Checklist:
1. Block registered in BlockManager.tsx
2. Container has correct CSS class: {blocktype}-container  
3. window.blockData contains data for block ID
4. PHP snippet renders container element correctly
5. No JavaScript errors in browser console

Debug steps:
```javascript
// Check if block data exists
console.log(window.blockData);

// Check if container exists  
document.querySelector('.your-block-container');

// Check BlockManager registration
console.log(blockComponents);
```

### Build Errors

TypeScript compilation issues:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Verify import paths use @ alias
# Correct: import { Button } from "@/components/ui/button"
# Incorrect: import { Button } from "../../components/ui/button"
```

Tailwind CSS issues:
```bash
# Verify Tailwind classes are valid
npm run build 2>&1 | grep -i "tailwind"

# Check CSS imports in index.css
# @import "tailwindcss" should be first
```

### Development Server Issues

Port conflicts:
```bash
# Check if ports are available
lsof -i :8888  # PHP server port
lsof -i :5173  # Vite server port

# Kill conflicting processes
kill -9 <PID>
```

Version compatibility:
```bash
# Verify versions meet requirements
php --version    # Should be 8.2+
node --version   # Should be 18+
npm --version    # Should be 9+
```

File permissions:
```bash
# Fix Kirby directory permissions
chmod -R 755 content/
chmod -R 755 storage/
chmod -R 755 media/

# Ensure web server can write
chown -R www-data:www-data content/ storage/ media/
```

### Debug Mode Features

When debug mode is enabled in Kirby configuration:

- Detailed error messages with full stack traces for PHP errors
- Block data logging with automatic logging of block data structures  
- File resolution logs showing detailed image/file resolution attempts
- Hot reloading with enhanced file watching for development

Performance debugging:
```javascript
// Monitor block mounting performance
console.time('block-mount');
// Block mounting code
console.timeEnd('block-mount');

// Check bundle size
npm run build -- --analyze
```

## Documentation

### Core Technologies
- [Kirby CMS Documentation](https://getkirby.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Advanced Features  
- [Three.js Manual](https://threejs.org/manual/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PHP 8.3 Release Notes](https://php.net/releases/8.3/en.php)

## Contributing

### Development Setup

1. Fork and clone the repository
   ```bash
   git clone https://github.com/yourusername/TAPstack.git
   cd TAPstack
   ```

2. Install dependencies
   ```bash
   composer install
   npm install
   ```

3. Start development environment
   ```bash
   npm run dev
   ```

### Guidelines

- Maintain the hybrid architecture philosophy
- Update documentation for new features
- Test across different browsers and devices
- Follow existing code patterns and naming conventions
- Ensure PHP and React components work together

### Code Style

TypeScript components:
```typescript
// Functional components with TypeScript
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>
}

// Destructuring with defaults
const { title = 'Default', style = 'primary' } = props
```

PHP code:
```php
<?php
// Use Kirby's fluent API
$articles = $page->children()
  ->listed()
  ->sortBy('date', 'desc')
  ->limit(10);
?>
```

## License

MIT License - see LICENSE.md for details.

## Acknowledgments

Built with:

- [Kirby CMS](https://getkirby.com) - File-based CMS
- [kirby-vite](https://github.com/arnoson/kirby-vite) - Kirby + Vite integration  
- [React](https://react.dev) - User interface library
- [Vite](https://vitejs.dev) - Frontend build tool
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Three.js](https://threejs.org) - 3D graphics library
- [TypeScript](https://typescriptlang.org) - JavaScript with types

Special thanks to arnoson for the kirby-vite plugin, Johann Schopplich for Kirby ecosystem contributions, and the Kirby team.
