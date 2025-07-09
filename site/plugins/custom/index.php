<?php

// Load all plugins from subdirectories in the custom folder
$pluginDirs = glob(__DIR__ . '/*', GLOB_ONLYDIR);

foreach ($pluginDirs as $pluginDir) {
    $pluginIndexFile = $pluginDir . '/index.php';
    if (file_exists($pluginIndexFile)) {
        require_once $pluginIndexFile;
    }
}