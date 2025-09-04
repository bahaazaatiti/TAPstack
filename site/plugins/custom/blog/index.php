<?php

Kirby::plugin('custom/blog', [
  'blueprints' => [
    'blocks/blog' => __DIR__ . '/blueprints/blocks/blog.yml'
  ],
  'snippets' => [
    'blocks/blog' => __DIR__ . '/snippets/blocks/blog.php'
  ]
]);
