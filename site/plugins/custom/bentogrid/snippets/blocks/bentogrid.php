<?php 
// Bento Grid block snippet - processes selected articles with smart fallback logic

$selectedArticles = $block->articles()->toPages();

// If no articles are manually selected, auto-select from current page or site
if ($selectedArticles->count() === 0) {
  // First try current page's children
  $pageArticles = $page->children()->filterBy('template', 'article')->listed();
  
  if ($pageArticles->count() > 0) {
    // Use current page's articles (limit to 6)
    $selectedArticles = $pageArticles->limit(6);
  } else {
    // Fallback to all site articles (limit to 6)
    $siteArticles = site()->index()->filterBy('template', 'article')->listed()->sortBy('date', 'desc');
    $selectedArticles = $siteArticles->limit(6);
  }
}

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
    'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(150),
    'category' => $article->parent() ? $article->parent()->title()->value() : 'Articles',
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
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Featured Articles',
  'articles' => $articles,
  'gridStyle' => $block->gridStyle()->isNotEmpty() ? $block->gridStyle()->value() : 'default'
];

// Add translations for current language (same as pass-block-data.php) if pass block data cant be merged, either copy them as demonstarted below, or make it a snippet?
// $blockData['translations'] = [
//   'search' => t('search'),
//   'back_to_top' => t('back_to_top'),
//   'hero_progress' => t('hero_progress'),
//   'search_dialog' => t('search_dialog'),
//   'pages' => t('pages'),
//   'navigation' => t('navigation'),
//   'read_more' => t('read_more'),
//   'search_result' => t('search_result'),
//   'cat_browser' => t('cat_browser'),
//   'min_read' => t('min_read'),
//   'by' => t('by'),
//   'read_article' => t('read_article'),
//   'author' => t('author'),
//   'article_info' => t('article_info'),
//   'files' => t('files'),
//   'about_author' => t('about_author'),
//   'available_downloads' => t('available_downloads'),
//   'article_shared' => t('article_shared'),
//   'url_copied' => t('url_copied'),
//   'copy_failed' => t('copy_failed')
// ];
?>

<div id="bentogrid-<?= $block->id() ?>" class="bentogrid-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['bentogrid-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
