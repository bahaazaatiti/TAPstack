<?php

Kirby::plugin('custom/applecarousel', [
    'blueprints' => [
        'blocks/applecarousel' => __DIR__ . '/blueprints/blocks/applecarousel.yml'
    ],
    'snippets' => [
        'blocks/applecarousel' => __DIR__ . '/snippets/blocks/applecarousel.php'
    ]
]);
