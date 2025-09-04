<?php 
// Featured Blog block snippet - uses pass-block-data.php for standardized processing
?>

<div id="featuredblog-<?= $block->id() ?>" class="featuredblog-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'featuredblog']) ?>
