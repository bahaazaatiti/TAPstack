<?php 
// Extract data from Kirby's $block object
$title = $block->title()->value();
$subtitle = $block->subtitle()->value();
$buttonText = $block->buttonText()->value();
$buttonUrl = $block->buttonUrl()->value();
$buttonExternal = $block->buttonExternal()->toBool();
$style = $block->style()->value();
?>

<!-- Create mounting point for Vue component -->
<div id="hero-<?= $block->id() ?>" class="hero-container"></div>

<script>
// Pass data to Vue component via global object
window.blockData = window.blockData || {};
window.blockData['hero-<?= $block->id() ?>'] = {
  title: <?= json_encode($title) ?>,
  subtitle: <?= json_encode($subtitle) ?>,
  buttonText: <?= json_encode($buttonText) ?>,
  buttonUrl: <?= json_encode($buttonUrl) ?>,
  buttonExternal: <?= json_encode($buttonExternal) ?>,
  style: <?= json_encode($style) ?>
};
</script>
