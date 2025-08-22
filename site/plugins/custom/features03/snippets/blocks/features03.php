<?php 
// Extract data from Kirby's $block object

?>

<!-- Create mounting point for React component -->
<div id="features03-<?= $block->id() ?>" class="features03-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'features03']) ?>
