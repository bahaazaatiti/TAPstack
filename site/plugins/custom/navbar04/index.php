<?php

Kirby::plugin('blogsite/navbar04-block', [
  'blueprints' => [
    'blocks/navbar04' => __DIR__ . '/blueprints/blocks/navbar04.yml'
  ],
  'snippets' => [
    'blocks/navbar04' => __DIR__ . '/snippets/blocks/navbar04.php'
  ]
]);
