<?php 
// Bento Grid block snippet - uses pass-block-data.php for standardized processing
?>

<div id="bentogrid-<?= $block->id() ?>" class="bentogrid-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'bentogrid']) ?>
