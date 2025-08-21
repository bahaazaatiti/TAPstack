<?php

Kirby::plugin('blogsite/textblock-block', [
  'blueprints' => [
    'blocks/textblock' => __DIR__ . '/blueprints/blocks/textblock.yml'
  ],
  'snippets' => [
    'blocks/textblock' => __DIR__ . '/snippets/blocks/textblock.php'
  ]
]);
