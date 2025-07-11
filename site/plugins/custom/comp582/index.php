<?php

Kirby::plugin('blogsite/comp582-block', [
  'blueprints' => [
    'blocks/comp582' => __DIR__ . '/blueprints/blocks/comp582.yml'
  ],
  'snippets' => [
    'blocks/comp582' => __DIR__ . '/snippets/blocks/comp582.php'
  ]
]);
