# Block Creation Guide

This project uses a generic Vue block system. Here's how to create new blocks:

## 1. Create Vue Component
Create your Vue component in `src/components/YourBlockName.vue`

## 2. Register in BlockManager
Add your component to the `blockComponents` registry in `src/components/BlockManager.vue`:

```javascript
import YourBlockName from './YourBlockName.vue'

const blockComponents = {
  navbar: Navbar,
  yourblockname: YourBlockName, // Add here
}
```

## 3. Create Kirby Plugin Structure
```
site/plugins/yourblockname/
├── index.php              # Plugin registration
├── index.js               # Panel preview (optional)
├── index.css              # Panel styles (optional)
├── blueprints/blocks/
│   └── yourblockname.yml  # Block blueprint
└── snippets/blocks/
    └── yourblockname.php  # PHP snippet template
```

## 4. PHP Snippet Template
```php
<?php 
// Extract your data from $block
$yourData = $block->yourField()->value();
?>

<div id="yourblockname-<?= $block->id() ?>" class="yourblockname-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['yourblockname-<?= $block->id() ?>'] = {
  yourData: <?= json_encode($yourData) ?>,
  // Add more data as needed
};
</script>
```

## 5. Vue Component Props
Your Vue component should accept props that match the data structure passed from PHP:

```vue
<template>
  <div>{{ yourData }}</div>
</template>

<script>
export default {
  props: {
    yourData: String,
    // Add more props as needed
  }
}
</script>
```

## Current Blocks
- `navbar` - Navigation bar with logo and links
