<?php 
// Latest Blog block snippet - uses pass-block-data.php with additional data for search URL

// Generate search URL for the parent blog
$parentPage = $page; // The current page where this block is placed
$searchUrl = site()->url() . '/search?blog=' . $parentPage->slug();

$additionalData = [
  'buttonUrl' => $searchUrl,
  'parentBlogSlug' => $parentPage->slug()
];
?>

<div id="latestblog-<?= $block->id() ?>" class="latestblog-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'latestblog', 'additionalData' => $additionalData]) ?>
