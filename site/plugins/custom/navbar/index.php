<?php

Kirby::plugin('blogsite/navbar-block', [
  'blueprints' => [
    'blocks/navbar' => __DIR__ . '/blueprints/blocks/navbar.yml'
  ],
  'snippets' => [
    'blocks/navbar' => __DIR__ . '/snippets/blocks/navbar.php'
  ]
]);
