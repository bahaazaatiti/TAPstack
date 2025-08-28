<?php

/**
 * AuthorBox Block Plugin
 * Displays author information with avatar, bio, and social links
 */

Kirby::plugin('custom/authorbox', [
    'blueprints' => [
        'blocks/authorbox' => __DIR__ . '/blueprints/blocks/authorbox.yml'
    ],
    'snippets' => [
        'blocks/authorbox' => __DIR__ . '/snippets/blocks/authorbox.php'
    ]
]);
