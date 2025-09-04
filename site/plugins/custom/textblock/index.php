<?php

Kirby::plugin('custom/textblock', [
  'blueprints' => [
    'blocks/textblock' => __DIR__ . '/blueprints/blocks/textblock.yml'
  ],
  'snippets' => [
    'blocks/textblock' => __DIR__ . '/snippets/blocks/textblock.php'
  ]
]);
