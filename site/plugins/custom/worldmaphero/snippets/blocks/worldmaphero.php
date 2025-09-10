<?php
/**
 * World Map Hero block snippet
 * Hero section with world map and static dot locations
 */
?>
<div id="worldmaphero-<?= $block->id() ?>" class="worldmaphero-container"></div>
<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'worldmaphero']); ?>
