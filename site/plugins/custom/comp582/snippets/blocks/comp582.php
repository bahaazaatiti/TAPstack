<?php
/**
 * Comp582 block snippet
 * Navigation component with site pages automatically included
 */
?>
<div id="comp582-<?= $block->id() ?>" class="comp582-container"></div>
<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'comp582']); ?>