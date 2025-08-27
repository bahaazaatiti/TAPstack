<?php 
// Latest Blog block snippet - fetches latest 8 blog articles from current page's children and passes data to React

// Get articles from the current page's children (like blog.php)
$articlePages = $page->children()->listed()->sortBy('date', 'desc');
$maxArticles = $block->maxArticles()->isNotEmpty() ? (int)$block->maxArticles()->value() : 8;
$articles = [];

foreach ($articlePages->limit($maxArticles) as $article) {
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
    'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(150),
    'category' => $article->category()->value(),
    'date' => $article->date()->toDate('M j, Y'),
    'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
    'url' => $article->url(),
    'author' => $authorName,
    'authorImage' => $authorImage,
    'tags' => $article->tags()->split(','),
    'featuredImage' => $featuredImage
  ];
}

// Prepare block data - using manual approach for now, can be converted to pass-block-data later
$blockData = [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Latest articles',
  'buttonText' => $block->buttonText()->isNotEmpty() ? $block->buttonText()->value() : 'View all articles',
  'buttonUrl' => $block->buttonUrl()->isNotEmpty() ? $block->buttonUrl()->value() : '/',
  'articles' => $articles
];
?>

<div id="latestblog-<?= $block->id() ?>" class="latestblog-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['latestblog-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
