<?php 
// Blog Globe block snippet - fetches articles with coordinates from current page's children

// Get articles from the current page's children that have coordinates
$articlePages = $page->children()->listed()->filterBy('template', 'article');
$articles = [];

foreach ($articlePages as $article) {
  // Only include articles that have both latitude and longitude
  $latitude = $article->latitude()->toFloat();
  $longitude = $article->longitude()->toFloat();
  
  if ($latitude && $longitude && 
      $latitude >= -90 && $latitude <= 90 && 
      $longitude >= -180 && $longitude <= 180) {
    
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

    $articles[] = [
      'title' => $article->title()->value(),
      'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(150),
      'category' => $article->category()->value(),
      'date' => $article->date()->toDate('M j, Y'),
      'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
      'url' => $article->url(),
      'author' => $authorName,
      'tags' => $article->tags()->split(','),
      'latitude' => $latitude,
      'longitude' => $longitude,
      'featuredImage' => $featuredImage
    ];
  }
}

// Prepare block data
$globeConfig = [
  'globeColor' => $block->globeColor()->isNotEmpty() ? $block->globeColor()->value() : '#1d1d1d',
  'autoRotate' => $block->autoRotate()->toBool(),
  'autoRotateSpeed' => $block->rotateSpeed()->isNotEmpty() ? (float)$block->rotateSpeed()->value() : 0.5,
];

$blockData = [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Stories Around the World',
  'description' => $block->description()->isNotEmpty() ? $block->description()->value() : 'Explore our articles from around the globe',
  'articles' => $articles,
  'globeConfig' => $globeConfig
];
?>

<div id="blogglobe-<?= $block->id() ?>" class="blogglobe-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['blogglobe-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
