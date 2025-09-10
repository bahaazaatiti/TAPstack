<?php

Kirby::plugin('custom/worldmaphero', [
  'blueprints' => [
    'blocks/worldmaphero' => __DIR__ . '/blueprints/blocks/worldmaphero.yml'
  ],
  'snippets' => [
    'blocks/worldmaphero' => __DIR__ . '/snippets/blocks/worldmaphero.php'
  ]
]);
