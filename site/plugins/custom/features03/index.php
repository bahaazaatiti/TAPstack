<?php

Kirby::plugin('blogsite/features03-block', [
  'blueprints' => [
    'blocks/features03' => __DIR__ . '/blueprints/blocks/features03.yml'
  ],
  'snippets' => [
    'blocks/features03' => __DIR__ . '/snippets/blocks/features03.php'
  ]
]);
