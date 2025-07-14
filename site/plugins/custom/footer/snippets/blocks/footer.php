<?php
/**
 * Footer block snippet
 * Passes all block data to React via pass-block-data
 */
?>
<div id="footer-<?= $block->id() ?>" class="footer-container"></div>
<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'footer']); ?>
