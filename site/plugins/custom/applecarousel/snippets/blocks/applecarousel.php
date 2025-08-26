<?php 
// Apple Cards Carousel block snippet - processes selected articles with featured images

$selectionMode = $block->selectionMode()->value() ?: 'manual';
$selectedArticles = $block->articles()->toPages();
$onlyWithImages = $block->onlyWithImages()->toBool();
$latestCount = (int)($block->latestCount()->value() ?: 10);

// Determine articles based on selection mode
if ($selectionMode === 'latest') {
  // Get latest articles from parent section
  $parentPage = $block->parent();
  
  if ($parentPage && $parentPage->hasChildren()) {
    // Get articles from the parent page (current section)
    $parentArticles = $parentPage->children()->filterBy('template', 'article')->listed()->sortBy('date', 'desc');
  } else {
    // Fallback to all site articles if no parent or no children
    $parentArticles = site()->index()->filterBy('template', 'article')->listed()->sortBy('date', 'desc');
  }
  
  if ($onlyWithImages) {
    // Filter to only articles with featured images
    $articlesWithImages = $parentArticles->filter(function($article) {
      return $article->featuredImage()->isNotEmpty() || $article->images()->count() > 0;
    });
    $selectedArticles = $articlesWithImages->limit($latestCount);
  } else {
    $selectedArticles = $parentArticles->limit($latestCount);
  }
} elseif ($selectionMode === 'manual' && $selectedArticles->count() === 0) {
  // Manual mode but no articles selected - auto-select from site as fallback
  $siteArticles = site()->index()->filterBy('template', 'article')->listed()->sortBy('date', 'desc');
  
  if ($onlyWithImages) {
    // Filter to only articles with featured images
    $articlesWithImages = $siteArticles->filter(function($article) {
      return $article->featuredImage()->isNotEmpty() || $article->images()->count() > 0;
    });
    $selectedArticles = $articlesWithImages->limit(10);
  } else {
    $selectedArticles = $siteArticles->limit(10);
  }
}

$articles = [];

foreach ($selectedArticles as $article) {
  // Get featured image - prioritize featured image, fallback to first image
  $featuredImage = null;
  $imageFile = null;
  
  if ($article->featuredImage()->isNotEmpty()) {
    $imageFile = $article->featuredImage()->toFile();
  } elseif ($article->images()->first()) {
    $imageFile = $article->images()->first();
  }
  
  if ($imageFile) {
    $featuredImage = [
      'url' => $imageFile->url(),
      'alt' => $imageFile->alt()->value() ?: $article->title()->value(),
      'width' => $imageFile->width(),
      'height' => $imageFile->height()
    ];
  }

  // Only include articles with images (unless manually selected)
  if ($featuredImage || $block->articles()->toPages()->count() > 0) {
    $articles[] = [
      'title' => $article->title()->value(),
      'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(200),
      'category' => $article->parent() ? $article->parent()->title()->value() : 'Articles',
      'date' => $article->date()->toDate('M j, Y'),
      'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
      'url' => $article->url(),
      'author' => $article->author()->value(),
      'tags' => $article->tags()->split(','),
      'featuredImage' => $featuredImage,
      'content' => $article->text()->kirbytext()->value()
    ];
  }
}

// Prepare block data
$blockData = [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Featured Stories',
  'articles' => $articles,
  'initialScroll' => $block->initialScroll()->isNotEmpty() ? (int)$block->initialScroll()->value() : 0
];
?>

<div id="applecarousel-<?= $block->id() ?>" class="applecarousel-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['applecarousel-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
