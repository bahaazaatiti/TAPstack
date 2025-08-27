<?php 
// Featured Blog block snippet - processes selected articles from current page's children

$selectedArticles = $block->featuredArticles()->toPages();
$articles = [];

foreach ($selectedArticles as $article) {
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

  // Get author information from user relationship
  $author = $article->author()->toUser();
  $authorName = $author ? $author->name()->value() : 'Unknown Author';
  
  // Get author image if available
  $authorImage = null;
  if ($author && $author->avatar()) {
    $avatarFile = $author->avatar();
    if ($avatarFile) {
      $authorImage = [
        'url' => $avatarFile->url(),
        'alt' => $author->name()->value()
      ];
    }
  }

  $articles[] = [
    'title' => $article->title()->value(),
    'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(200),
    'category' => $page->title()->value(), // Use parent page title as category
    'date' => $article->date()->toDate('M j, Y'),
    'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
    'url' => $article->url(),
    'author' => $authorName,
    'authorImage' => $authorImage,
    'tags' => $article->tags()->split(','),
    'featuredImage' => $featuredImage
  ];
}

// Prepare block data
$blockData = [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Latest articles',
  'articles' => $articles
];
?>

<div id="featuredblog-<?= $block->id() ?>" class="featuredblog-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['featuredblog-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
