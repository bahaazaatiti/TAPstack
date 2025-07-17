<?php 
// Blog block snippet - fetches blog articles from current page's children and passes data to React

// Get articles from the current page's children
$articlePages = $page->children()->listed()->sortBy('date', 'desc');
$articles = [];

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
