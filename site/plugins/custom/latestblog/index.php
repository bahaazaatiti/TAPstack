<?php

Kirby::plugin('custom/latestblog', [
  'blueprints' => [
    'blocks/latestblog' => __DIR__ . '/blueprints/blocks/latestblog.yml'
  ],
  'snippets' => [
    'blocks/latestblog' => __DIR__ . '/snippets/blocks/latestblog.php'
  ]
]);
