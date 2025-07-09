<?php 
// Extract data from Kirby's $block object

?>

<!-- Create mounting point for React component -->
<div id="hero-<?= $block->id() ?>" class="hero-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'hero']) ?>
