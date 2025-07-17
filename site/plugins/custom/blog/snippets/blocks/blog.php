<?php 
// Blog block snippet - fetches blog articles from current page's children and passes data to React
//TODO: add this in passblockdata once values finalized

// Get articles from the current page's children
$articlePages = $page->children()->listed()->sortBy('date', 'desc');
$articles = [];

foreach ($articlePages as $article) {
  // Get featured image if available
  $featuredImage = null;
  if ($article->featuredImage()->isNotEmpty()) {
    $imageFile = $article->featuredImage()->toFile();
    if ($imageFile) {
      $featuredImage = [
        'url' => $imageFile->url(),
        'alt' => $imageFile->alt()->value() ?: $article->title()->value(),
        'width' => $imageFile->width(),
        'height' => $imageFile->height()
      ];
    }
  } elseif ($article->images()->first()) {
    // Fallback to first image if no featured image set
    $imageFile = $article->images()->first();
    $featuredImage = [
      'url' => $imageFile->url(),
      'alt' => $imageFile->alt()->value() ?: $article->title()->value(),
      'width' => $imageFile->width(),
      'height' => $imageFile->height()
    ];
  }

  $articles[] = [
    'title' => $article->title()->value(),
    'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(200),
    'category' => $article->category()->value(),
    'date' => $article->date()->toDate('M j, Y'),
    'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
    'url' => $article->url(),
    'author' => $article->author()->value(),
    'tags' => $article->tags()->split(','),
    'featuredImage' => $featuredImage
  ];
}

// Prepare block data for React
$blockData = [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Posts',
  'showCategories' => $block->showCategories()->toBool(),
  'postsPerPage' => $block->postsPerPage()->isNotEmpty() ? (int)$block->postsPerPage()->value() : 8,
  'articles' => $articles
];
?>

<div id="blog-<?= $block->id() ?>" class="blog-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['blog-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
