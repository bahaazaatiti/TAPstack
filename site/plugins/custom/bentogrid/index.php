<?php

Kirby::plugin('custom/bentogrid', [
    'blueprints' => [
        'blocks/bentogrid' => __DIR__ . '/blueprints/blocks/bentogrid.yml'
    ],
    'snippets' => [
        'blocks/bentogrid' => __DIR__ . '/snippets/blocks/bentogrid.php'
    ]
]);
