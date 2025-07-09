# Kirby React Blocks Stack

A CMS built on TypeScript, Tailwind CSS, and PHP, combining Kirby CMS with React components through a unified block architecture.

## Architecture Overview

This system implements a hybrid CMS architecture where Kirby CMS manages content and provides administrative interfaces, while React components handle interactive frontend behavior. The integration layer uses a block-based system that bridges PHP server-side rendering with client-side React hydration. 

### Core Components

```
Backend Layer:     Kirby CMS 5.x + PHP 8.3
Frontend Layer:    React 19 + TypeScript + Tailwind CSS 4
Build System:      Vite 7 + HMR
Integration:       Custom Block System + kirby-vite plugin
```

## System Requirements

- PHP 8.2, 8.3, or 8.4
- Node.js 18+ with npm
- Composer 2.x

## Installation

Clone the repository and install dependencies:

```bash
composer install
npm install
```

## Development Workflow

Start the development environment:

```bash
npm run dev
```

This command initializes two concurrent processes:
- PHP development server on `localhost:8888`
- Vite development server on `localhost:5173` (assets only)

The Vite server provides hot module replacement for React components and Tailwind CSS, while the PHP server handles Kirby CMS functionality and server-side rendering.

## Block System Architecture

### Data Flow

```
Kirby Admin Panel → Block Configuration → PHP Snippet → window.blockData → React Component
```

### Block Registration Process

1. **Backend Registration**: Kirby plugins define block blueprints and PHP snippets
2. **Frontend Registration**: React components are registered in BlockManager
3. **Runtime Mounting**: BlockManager scans DOM for block containers and mounts React components
4. **Data Injection**: PHP snippets serialize block data to JavaScript global scope

### Block Structure

Each block consists of four components:

```
site/plugins/custom/{blockname}/
├── index.php                           # Kirby plugin registration
├── blueprints/blocks/{blockname}.yml   # Admin interface definition
└── snippets/blocks/{blockname}.php     # Server-side rendering template

src/components/{BlockName}.tsx           # React component implementation
```

### Implementation Details

#### Block Data Utility

The system includes a reusable `pass-block-data` snippet that eliminates repetitive data serialization:

```php
// site/snippets/pass-block-data.php
<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'blockname']) ?>
```

This utility automatically:
- Serializes all block content fields via `$block->content()->toArray()`
- Creates the appropriate JavaScript global variable
- Maintains consistent naming conventions across blocks

#### PHP Snippet Template

```php
<?php 
// No manual data extraction needed
?>

<div id="{blockname}-<?= $block->id() ?>" class="{blockname}-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => '{blockname}']) ?>
```

The `pass-block-data` snippet automatically serializes all block content fields to the JavaScript global scope, eliminating manual data extraction and JSON encoding.

#### React Component Registration

```typescript
// src/components/BlockManager.tsx
const blockComponents: Record<string, ComponentType<any>> = {
  blockname: BlockComponent,
};
```

#### React Component Props

React components receive all block fields as props through the `pass-block-data` utility. Use generic interfaces with destructuring:

```typescript
interface BlockProps {
  [key: string]: any; // All block fields automatically available
}

const BlockComponent: React.FC<BlockProps> = (props) => {
  const {
    fieldName = 'defaultValue',
    anotherField = false,
  } = props;
  // Field names match exactly with Kirby blueprint definitions
};
```

#### Component Mounting

The BlockManager uses MutationObserver to detect dynamically added blocks and creates React roots using React 18's createRoot API:

```typescript
const mountBlockType = (blockType: string) => {
  const containers = document.querySelectorAll(`.${blockType}-container:not([data-react-mounted])`);
  
  containers.forEach(container => {
    const blockId = container.id;
    const data = window.blockData?.[blockId];
    
    if (data && blockComponents[blockType]) {
      const root = createRoot(container);
      const BlockComponent = blockComponents[blockType];
      
      root.render(<BlockComponent {...data} />);
      container.setAttribute('data-react-mounted', 'true');
    }
  });
};
```

## Available Blocks

### Navbar Block

Navigation component with responsive mobile menu, external link handling, and theme variants.

**Configuration Fields:**
- Logo text (string)
- Navigation links (structure: title, url, external flag)
- Style variant (default, dark, light)

### Hero Block

Landing page hero section with call-to-action button and background style options.

**Configuration Fields:**
- Title (string)
- Subtitle (textarea)
- Button text and URL (string, url)
- External link flag (boolean)
- Style variant (default gradient, dark, light)

## Creating New Blocks

### 1. Kirby Plugin Structure

Create the plugin directory:

```bash
mkdir -p site/plugins/custom/{blockname}/{blueprints/blocks,snippets/blocks}
```

### 2. Plugin Registration

```php
// site/plugins/custom/{blockname}/index.php
<?php

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
name: Block Name
icon: icon-name
fields:
  field1:
    label: Field Label
    type: text
    required: true
```

### 4. PHP Snippet

```php
<?php 
// site/plugins/custom/{blockname}/snippets/blocks/{blockname}.php
// No manual data extraction needed
?>

<div id="{blockname}-<?= $block->id() ?>" class="{blockname}-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => '{blockname}']) ?>
```

### 5. React Component

```typescript
// src/components/{BlockName}.tsx
import React from 'react';

interface {BlockName}Props {
  [key: string]: any; // All block fields automatically available
}

const {BlockName}: React.FC<{BlockName}Props> = (props) => {
  const {
    field1 = '',
    // Extract any field defined in your blueprint
  } = props;

  return (
    <div className="{blockname}">
      {field1}
    </div>
  );
};

export default {BlockName};
```

Block field names in Kirby blueprints map directly to props in React components. Use destructuring with default values to handle optional fields.

### 6. Component Registration

```typescript
// src/components/BlockManager.tsx
import {BlockName} from './{BlockName}';

const blockComponents: Record<string, ComponentType<any>> = {
  // ...existing blocks...
  {blockname}: {BlockName},
};
```

### 7. Page Blueprint Registration

```yaml
# site/blueprints/pages/blocks.yml
fields:
  blocks:
    type: blocks
    fieldsets:
      - navbar
      - hero
      - {blockname}  # Add new block here
```

## Build Process

### Development

```bash
npm run dev      # Start development servers with HMR
npm run vite     # Vite development server only
npm run server   # PHP development server only
```

### Production

```bash
npm run build    # Build optimized assets to public/dist
npm run preview  # Build and serve production preview
```

## Configuration

### Vite Configuration

```javascript
// vite.config.js
export default ({ mode }) => ({
  root: 'src',
  base: mode === 'development' ? '/' : '/dist/',
  build: {
    outDir: resolve(process.cwd(), 'public/dist'),
    rollupOptions: { input: resolve(process.cwd(), 'src/index.tsx') }
  },
  plugins: [react(), kirby(), tailwindcss()]
});
```

### Kirby Configuration

Debug mode is enabled for localhost:

```php
// site/config/config.localhost.php
return [
  'debug' => true
];
```

## TypeScript Configuration

The project uses a multi-configuration setup:
- `tsconfig.json`: Project references and path mapping
- `tsconfig.app.json`: Application compilation settings
- `tsconfig.node.json`: Node.js tooling configuration

## Styling Architecture

Tailwind CSS 4 with Vite plugin integration provides utility-first styling. Component styles are scoped to individual React components with responsive design patterns built-in.

## Development Notes

### Hot Module Replacement

React Fast Refresh is configured for instant component updates during development. The kirby-vite plugin watches PHP templates, snippets, and content for full-page reloads when server-side code changes.

### State Management

Block state is managed through React component props passed from server-side data. No client-side state management library is required for the current block implementations.

### Performance Considerations

- React components are mounted only when their containers are detected
- MutationObserver efficiently handles dynamic content changes
- Vite's code splitting optimizes bundle sizes
- Tailwind CSS purging removes unused styles in production

## Deployment

### Asset Building

```bash
npm run build
```

Assets are built to `public/dist` with filename hashing for cache busting.

### Server Requirements

- Web server with PHP 8.2+ support
- URL rewriting for Kirby's routing system
- Proper file permissions for content directory

### Environment Configuration

Production environments should disable debug mode and configure appropriate caching strategies through Kirby's configuration system.

## Troubleshooting

### Block Not Mounting

1. Verify block is registered in BlockManager
2. Check container class name matches block type
3. Ensure window.blockData contains expected data
4. Verify PHP snippet renders container element

### Build Errors

1. Check TypeScript compilation in terminal output
2. Verify all imports are correctly typed
3. Ensure Tailwind classes are valid
4. Check Vite configuration for path resolution

### Development Server Issues

1. Verify PHP and Node.js versions meet requirements
2. Check port availability (8888, 5173)
3. Ensure composer and npm dependencies are installed
4. Check file permissions for content directory

## License

MIT License

Upload the repository to your web server and point your web server to the repository's `public` folder.

### Rsync

If you have ssh access you can use rsync to automate the upload/sync.

### Git

You can also deploy your repository with git. Then you have to run the [installation](#installation) steps again on your web server.
