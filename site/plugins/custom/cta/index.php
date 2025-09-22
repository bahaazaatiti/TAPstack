<?php

Kirby::plugin('custom/cta', [
  'blueprints' => [
    'blocks/cta' => __DIR__ . '/blueprints/blocks/cta.yml'
  ],
  'snippets' => [
    'blocks/cta' => __DIR__ . '/snippets/blocks/cta.php'
  ]
]);
