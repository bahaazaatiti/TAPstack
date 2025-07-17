<?php 
// Blog block snippet - fetches blog articles and passes data to React

// Get the blog page (can be configured via block field or default to 'blog')
$blogPage = $site->find('blog');
$articles = [];

if ($blogPage) {
  $articlePages = $blogPage->children()->listed()->sortBy('date', 'desc');
  
  foreach ($articlePages as $article) {
    $articles[] = [
      'title' => $article->title()->value(),
      'description' => $article->description()->isNotEmpty() ? $article->description()->value() : $article->text()->excerpt(200),
      'category' => $article->category()->value(),
      'date' => $article->date()->toDate('M j, Y'),
      'readTime' => $article->readTime()->isNotEmpty() ? (int)$article->readTime()->value() : 5,
      'url' => $article->url(),
      'author' => $article->author()->value(),
      'tags' => $article->tags()->split(',')
    ];
  }
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
