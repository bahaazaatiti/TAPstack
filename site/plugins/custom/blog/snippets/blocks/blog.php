<?php 
// Blog block snippet - fetches blog articles from current page's children and passes data to React
//TODO: add this in passblockdata once values finalized

// Check if this is a search page
$isSearchPage = $page->intendedTemplate()->name() === 'search';
$searchQuery = '';
$blogParam = '';
$blogParamTitle = ''; // Add this to store the localized title

if ($isSearchPage) {
  // Get search query from URL parameters
  $searchQuery = get('q', '');
  // Get blog parameter for parent-specific search
  $blogParam = get('blog', '');
  
  if ($blogParam) {
    // Search within a specific blog (parent-specific search)
    $blogPage = page($blogParam);
    if ($blogPage) {
      // Get the localized title of the blog page
      $blogParamTitle = $blogPage->title()->value();
      
      if ($searchQuery) {
        // Search within the specific blog with query
        $articlePages = $blogPage->children()
          ->filterBy('intendedTemplate', 'article')
          ->search($searchQuery, ['fields' => ['title', 'text', 'description', 'author', 'category', 'type']])
          ->sortBy('date', 'desc');
      } else {
        // Show all articles from the specific blog
        $articlePages = $blogPage->children()
          ->filterBy('intendedTemplate', 'article')
          ->sortBy('date', 'desc');
      }
    } else {
      // Blog not found, show empty results
      $articlePages = new \Kirby\Cms\Pages();
    }
  } else {
    // Global search across all articles
    if ($searchQuery) {
      $articlePages = site()->index()
        ->filterBy('intendedTemplate', 'article')
        ->search($searchQuery, ['fields' => ['title', 'text', 'description', 'author', 'category', 'type']])
        ->sortBy('date', 'desc');
    } else {
      // No search query, show all articles
      $articlePages = site()->index()
        ->filterBy('intendedTemplate', 'article')
        ->sortBy('date', 'desc');
    }
  }
} else {
  // Get articles from the current page's children (normal blog behavior)
  $articlePages = $page->children()->listed()->sortBy('date', 'desc');
}

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
    'title' => (string)$article->title()->value(),
    'description' => $article->description()->isNotEmpty() ? (string)$article->description()->value() : (string)$article->text()->excerpt(200),
    'category' => (string)$article->category()->value(),
  'type' => trim((string)$article->type()->value()) !== '' ? trim((string)$article->type()->value()) : 'Unknown',
    'date' => $article->date()->toDate('M j, Y'),
    'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
    'url' => (string)$article->url(),
    'author' => $authorName,
    'authorImage' => $authorImage,
    'tags' => $article->tags()->split(','),
    'featuredImage' => $featuredImage
  ];
}

?>

<div id="blog-<?= $block->id() ?>" class="blog-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'blog', 'additionalData' => [
  'title' => $block->title()->isNotEmpty() ? $block->title()->value() : 'Posts',
  'showCategories' => $block->showCategories()->toBool(),
  'postsPerPage' => $block->postsPerPage()->isNotEmpty() ? (int)$block->postsPerPage()->value() : 20,
  'articles' => $articles,
  'searchQuery' => $searchQuery,
  'blogParam' => $blogParam,
  'blogParamTitle' => $blogParamTitle
]]) ?>
