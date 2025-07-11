<?php 
// Get site pages for navigation
// TODO: move this section to pass-block-data snippet
// make pass-block-data somehow query everything somehow,
// i did it like that cause usually in kirby u have to call everything
// and i basically just made a generalized snippet
$sitePages = [];
foreach ($site->children()->listed() as $page) {
  $sitePages[] = [
    'title' => $page->title()->toString(),
    'url' => $page->url(),
    'slug' => $page->slug(),
    'isActive' => $page->isActive()
  ];
}
?>

<div id="comp582-<?= $block->id() ?>" class="comp582-container"></div>

<?php 
// Use pass-block-data but manually add sitepages after
snippet('pass-block-data', ['block' => $block, 'blockType' => 'comp582']);
?>

<script>
// Add site pages data to the existing block data
if (window.blockData && window.blockData['comp582-<?= $block->id() ?>']) {
  window.blockData['comp582-<?= $block->id() ?>'].sitepages = <?= json_encode($sitePages) ?>;
}
</script>
