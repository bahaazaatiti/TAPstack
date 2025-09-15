<?php 
// World Map Hero block snippet - processes selected articles with coordinates

$selectionMode = $block->selectionMode()->value() ?: 'manual';
$selectedArticles = $block->articles()->toPages();
$onlyWithCoordinates = $block->onlyWithCoordinates()->toBool();
$latestCount = (int)($block->latestCount()->value() ?: 10);
$filterCategory = $block->filterCategory()->value();
$categoryCount = (int)($block->categoryCount()->value() ?: 10);

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
  
  if ($onlyWithCoordinates) {
    // Filter to only articles with coordinates
    $articlesWithCoords = $parentArticles->filter(function($article) {
      return $article->latitude()->isNotEmpty() && $article->longitude()->isNotEmpty();
    });
    $selectedArticles = $articlesWithCoords->limit($latestCount);
  } else {
    $selectedArticles = $parentArticles->limit($latestCount);
  }
} elseif ($selectionMode === 'category') {
  // Get latest articles from specific category
  $categoryArticles = site()->index()->filterBy('template', 'article')->listed();
  
  if ($filterCategory) {
    $categoryArticles = $categoryArticles->filterBy('category', $filterCategory);
  }
  
  $categoryArticles = $categoryArticles->sortBy('date', 'desc');
  
  if ($onlyWithCoordinates) {
    // Filter to only articles with coordinates
    $articlesWithCoords = $categoryArticles->filter(function($article) {
      return $article->latitude()->isNotEmpty() && $article->longitude()->isNotEmpty();
    });
    $selectedArticles = $articlesWithCoords->limit($categoryCount);
  } else {
    $selectedArticles = $categoryArticles->limit($categoryCount);
  }
} elseif ($selectionMode === 'manual' && $selectedArticles->count() === 0) {
  // Manual mode but no articles selected - auto-select from site as fallback
  $siteArticles = site()->index()->filterBy('template', 'article')->listed()->sortBy('date', 'desc');
  
  if ($onlyWithCoordinates) {
    // Filter to only articles with coordinates
    $articlesWithCoords = $siteArticles->filter(function($article) {
      return $article->latitude()->isNotEmpty() && $article->longitude()->isNotEmpty();
    });
    $selectedArticles = $articlesWithCoords->limit(10);
  } else {
    $selectedArticles = $siteArticles->limit(10);
  }
}

$articles = [];

foreach ($selectedArticles as $article) {
  // Only include articles with coordinates
  if ($article->latitude()->isNotEmpty() && $article->longitude()->isNotEmpty()) {
    // Get author information from user relationship
    $author = $article->author()->toUser();
    $authorName = $author ? $author->name()->value() : 'Unknown Author';

    $articles[] = [
      'lat' => (float)$article->latitude()->value(),
      'lng' => (float)$article->longitude()->value(),
      'label' => $article->title()->value(),
      'population' => $article->description()->isNotEmpty() ? $article->description()->value() : 'No description',
      'associations' => $article->tags()->split(','),
      'url' => $article->url(),
      'author' => $authorName,
      'category' => $article->category()->value() ?: 'Article',
      'date' => $article->date()->toDate('M j, Y'),
      'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5
    ];
  }
}

// Prepare block data
$blockData = [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Connected Across Continents',
  'subtitle' => $block->subtitle()->isNotEmpty() ? $block->subtitle()->value() : 'Our presence spans across continents.',
  'bottomtext' => $block->bottomtext()->isNotEmpty() ? $block->bottomtext()->value() : 'For a United Assembly of Alawites worldwide.',
  'articles' => $articles
];
?>

<div id="worldmaphero-<?= $block->id() ?>" class="worldmaphero-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['worldmaphero-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
