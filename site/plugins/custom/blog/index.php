<?php

Kirby::plugin('blogsite/blog-block', [
  'blueprints' => [
    'blocks/blog' => __DIR__ . '/blueprints/blocks/blog.yml'
  ],
  'snippets' => [
    'blocks/blog' => __DIR__ . '/snippets/blocks/blog.php'
  ]
]);
