<?php

Kirby::plugin('project/blogglobe-block', [
  'blueprints' => [
    'blocks/blogglobe' => __DIR__ . '/blueprints/blocks/blogglobe.yml'
  ],
  'snippets' => [
    'blocks/blogglobe' => __DIR__ . '/snippets/blocks/blogglobe.php'
  ]
]);
