<?php

Kirby::plugin('custom/featuredblog', [
  'blueprints' => [
    'blocks/featuredblog' => __DIR__ . '/blueprints/blocks/featuredblog.yml'
  ],
  'snippets' => [
    'blocks/featuredblog' => __DIR__ . '/snippets/blocks/featuredblog.php'
  ]
]);
