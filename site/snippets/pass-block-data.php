<?php
/**
 * Reusable snippet to pass block data to JavaScript
 * 
 * @param Kirby\Cms\Block $block - The block object
 * @param string $blockType - The block type (e.g., 'hero', 'navbar')
 */

if (!isset($block) || !isset($blockType)) {
    throw new Exception('pass-block-data snippet requires $block and $blockType variables');
}

$blockId = $blockType . '-' . $block->id();
?>

<script>
window.blockData = window.blockData || {};
window.blockData['<?= $blockId ?>'] = <?= json_encode($block->content()->toArray()) ?>;
</script>
