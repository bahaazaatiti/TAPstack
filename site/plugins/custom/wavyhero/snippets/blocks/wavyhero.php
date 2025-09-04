<?php 
// Extract data from Kirby's $block object

?>

<!-- Create mounting point for React component -->
<div id="wavyhero-<?= $block->id() ?>" class="wavyhero-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'wavyhero']) ?>
