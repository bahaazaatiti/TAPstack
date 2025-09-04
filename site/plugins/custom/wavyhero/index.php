<?php

Kirby::plugin('custom/wavyhero', [
    'blueprints' => [
        'blocks/wavyhero' => __DIR__ . '/blueprints/blocks/wavyhero.yml'
    ],
    'snippets' => [
        'blocks/wavyhero' => __DIR__ . '/snippets/blocks/wavyhero.php'
    ]
]);
