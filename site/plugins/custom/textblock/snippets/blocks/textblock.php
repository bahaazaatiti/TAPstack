<?php 
// Extract data from Kirby's $block object

?>

<!-- Create mounting point for React component -->
<div id="textblock-<?= $block->id() ?>" class="textblock-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'textblock']) ?>
