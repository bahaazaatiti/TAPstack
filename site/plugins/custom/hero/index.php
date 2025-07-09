<?php

Kirby::plugin('blogsite/hero-block', [
  'blueprints' => [
    'blocks/hero' => __DIR__ . '/blueprints/blocks/hero.yml'
  ],
  'snippets' => [
    'blocks/hero' => __DIR__ . '/snippets/blocks/hero.php'
  ]
]);
