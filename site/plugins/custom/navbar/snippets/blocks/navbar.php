<?php 
$logo = $block->logo()->value();
$links = $block->links()->toStructure();
$style = $block->style()->value();

// Convert links to array safely
$linksArray = [];
if ($links && $links->count() > 0) {
  foreach ($links as $link) {
    $linksArray[] = [
      'title' => $link->title()->value(),
      'url' => $link->url()->value(),
      'external' => $link->external()->toBool()
    ];
  }
}
?>

<div id="navbar-<?= $block->id() ?>" class="navbar-container"></div>

<script>
// Pass data to Vue component using generic block data system
window.blockData = window.blockData || {};
window.blockData['navbar-<?= $block->id() ?>'] = {
  logo: <?= json_encode($logo) ?>,
  links: <?= json_encode($linksArray) ?>,
  style: <?= json_encode($style) ?>
};
</script>
