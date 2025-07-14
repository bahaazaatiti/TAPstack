<?php
Kirby::plugin('custom/footer', [
  'blueprints' => [
    'blocks/footer' => __DIR__ . '/blueprints/blocks/footer.yml',
  ],
  'snippets' => [
    'blocks/footer' => __DIR__ . '/snippets/blocks/footer.php',
  ],
]);
