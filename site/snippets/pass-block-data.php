<?php

/**
 * //TODO: remove debugging logs in production
 * Reusable snippet to pass block data to JavaScript with enhanced image support
 * 
 * @param Kirby\Cms\Block $block - The block object
 * @param string $blockType - The block type (e.g., 'hero', 'navbar')
 * @param array $additionalData - Optional additional data to merge with block data
 */

if (!isset($block) || !isset($blockType)) {
    throw new Exception('pass-block-data snippet requires $block and $blockType variables');
}

$blockId = $blockType . '-' . $block->id();

// Get base content array
$blockData = $block->content()->toArray();

// Process all fields to handle structure fields and file fields correctly
foreach ($block->content()->fields() as $field) {
    $key = $field->key();
    $value = $field->value();

    // Process file fields
    if (is_array($value) && !empty($value)) {
        $firstItem = reset($value);
        if (is_string($firstItem) && strpos($firstItem, 'file://') === 0) {
            $processedFiles = [];
            foreach ($value as $fileRef) {
                // Debug: Log what we're looking for
                error_log("Processing file field '$key' with fileRef: $fileRef");
                
                // Try different ways to find the file
                $file = null;
                
                // Method 1: Use Kirby's built-in UUID resolution
                // If the fileRef starts with 'file://', it's a UUID reference
                if (strpos($fileRef, 'file://') === 0) {
                    // Try to find by UUID using Kirby's built-in method
                    $file = kirby()->file($fileRef);
                    if ($file) {
                        error_log("Found file by UUID: " . $file->filename());
                    }
                } else {
                    // If it's not a UUID reference, try as direct file reference
                    $parentPage = $block->parent();
                    $file = $parentPage->file($fileRef);
                    if ($file) {
                        error_log("Found file by direct reference: " . $file->filename());
                    }
                }
                
                // Fallback: Manual search if Kirby's method didn't work
                if (!$file) {
                    $fileId = str_replace('file://', '', $fileRef);
                    error_log("Fallback search for UUID: $fileId");
                    
                    // Search in parent page
                    $parentPage = $block->parent();
                    foreach ($parentPage->files() as $pageFile) {
                        if ($pageFile->uuid()->toString() === $fileRef || $pageFile->uuid()->toString() === 'file://' . $fileId) {
                            $file = $pageFile;
                            error_log("Found file by UUID in parent: " . $file->filename());
                            break;
                        }
                    }
                    
                    // Search in site files if not found in parent
                    if (!$file) {
                        foreach (site()->files() as $siteFile) {
                            if ($siteFile->uuid()->toString() === $fileRef || $siteFile->uuid()->toString() === 'file://' . $fileId) {
                                $file = $siteFile;
                                error_log("Found file by UUID in site: " . $file->filename());
                                break;
                            }
                        }
                    }
                    
                    // Final search across all pages
                    if (!$file) {
                        foreach (site()->index() as $page) {
                            foreach ($page->files() as $pageFile) {
                                if ($pageFile->uuid()->toString() === $fileRef || $pageFile->uuid()->toString() === 'file://' . $fileId) {
                                    $file = $pageFile;
                                    error_log("Found file by UUID in page: " . $file->filename() . " on page: " . $page->title());
                                    break 2;
                                }
                            }
                        }
                    }
                }
                
                if ($file) {
                    error_log("Found file: " . $file->filename() . " (type: " . $file->type() . ")");
                    
                    if ($file->type() === 'image') {
                        $processedFiles[] = [
                            'url' => $file->url(),
                            'alt' => $file->alt()->value(),
                            'srcset' => $file->srcset(),
                            'width' => $file->width(),
                            'height' => $file->height(),
                            'filename' => $file->filename()
                        ];
                    } else {
                        error_log("File is not an image, type: " . $file->type());
                    }
                } else {
                    error_log("File not found anywhere for reference: $fileRef");
                    
                    // Debug: Let's see what files are actually available
                    error_log("Available files in parent:");
                    foreach ($block->parent()->files() as $availableFile) {
                        error_log("  - ID: " . $availableFile->id() . " UUID: " . $availableFile->uuid()->toString() . " (" . $availableFile->filename() . ")");
                    }
                    
                    error_log("Available files in site:");
                    foreach (site()->files() as $availableFile) {
                        error_log("  - ID: " . $availableFile->id() . " UUID: " . $availableFile->uuid()->toString() . " (" . $availableFile->filename() . ")");
                    }
                }
            }

            // Since we can't reliably access blueprint field definitions,
            // we'll use a simple heuristic: if only one file, treat as single file field
            if (!empty($processedFiles)) {
                if (count($processedFiles) === 1) {
                    // Single file - return as object
                    $blockData[$key] = $processedFiles[0];
                    error_log("Set single file for field '$key'");
                } else {
                    // Multiple files - return as array
                    $blockData[$key] = $processedFiles;
                    error_log("Set multiple files for field '$key'");
                }
            } else {
                // No valid files found - set to null
                $blockData[$key] = null;
                error_log("No valid files found for field '$key', setting to null");
            }
        }
    }
    // Process structure fields
    elseif ($field->type() === 'structure') {
        $blockData[$key] = $field->toStructure()->toArray();
    }
    // Keep other fields as they are (already in the array)
}

// Add common site data that blocks might need
$siteData = [
    'sitepages' => [],
    'currentPage' => [],
    'site' => []
];

// Get site pages for navigation (commonly needed)
foreach (site()->children()->listed() as $page) {
    $siteData['sitepages'][] = [
        'title' => $page->title()->toString(),
        'url' => $page->url(),
        'slug' => $page->slug(),
        'isActive' => $page->isActive()
    ];
}

// Get current page info
if (isset($page)) {
    $siteData['currentPage'] = [
        'title' => $page->title()->toString(),
        'url' => $page->url(),
        'slug' => $page->slug(),
        'isActive' => $page->isActive()
    ];
}

// Get site info
$siteData['site'] = [
    'title' => site()->title()->toString(),
    'url' => site()->url(),
    'language' => kirby()->language() ? kirby()->language()->code() : 'en',
    'languages' => []
];

// Get available languages
if (kirby()->multilang()) {
    foreach (kirby()->languages() as $language) {
        $siteData['site']['languages'][] = [
            'code' => $language->code(),
            'name' => $language->name(),
            'url' => $language->url(),
            'isDefault' => $language->isDefault()
        ];
    }
}

// Add translations for current language
$siteData['translations'] = [
    'search' => t('search'),
    'back_to_top' => t('back_to_top'),
    'hero_progress' => t('hero_progress'),
    'search_dialog' => t('search_dialog'),
    'pages' => t('pages'),
    'navigation' => t('navigation'),
    'read_more' => t('read_more'),
    'search_result' => t('search_result'),
    'cat_browser' => t('cat_browser'),
    'min_read' => t('min_read'),
    'by' => t('by'),
    'read_article' => t('read_article'),
    'author' => t('author'),
    'article_info' => t('article_info'),
    'files' => t('files'),
    'about_author' => t('about_author'),
    'available_downloads' => t('available_downloads'),
    'article_shared' => t('article_shared'),
    'url_copied' => t('url_copied'),
    'copy_failed' => t('copy_failed'),
    'logo' => t('logo'),
    'home_tooltip' => t('home_tooltip'),
    'logo_assets' => t('logo_assets'),
    'light_mode' => t('light_mode'),
    'dark_mode' => t('dark_mode'),
    'go_home' => t('go_home'),
    'select_language' => t('select_language'),
    'language' => t('language'),
    'page' => t('page'),
    'subpage' => t('subpage'),
    'quick_actions' => t('quick_actions'),
    'choose_action' => t('choose_action'),
    'github' => t('github'),
    'report_bugs' => t('report_bugs'),
    'login' => t('login'),
    'access_panel' => t('access_panel'),
    'show_less' => t('show_less'),
    'content_copied' => t('content_copied'),
    // Blog component translations
    'search_articles' => t('search_articles'),
    'no_articles_found' => t('no_articles_found'),
    'suggestions' => t('suggestions'),
    'clear_date_filter' => t('clear_date_filter'),
    'sort_by' => t('sort_by'),
    'clear_all_filters' => t('clear_all_filters'),
    'newest_first' => t('newest_first'),
    'oldest_first' => t('oldest_first'),
    'quick_reads' => t('quick_reads'),
    'long_reads' => t('long_reads'),
    'a_to_z' => t('a_to_z'),
    'z_to_a' => t('z_to_a'),
    'active_filters' => t('active_filters'),
    'search_label' => t('search_label'),
    'date_label' => t('date_label'),
    'sort_label' => t('sort_label'),
    'showing' => t('showing'),
    'of' => t('of'),
    'articles' => t('articles'),
    'for_search' => t('for_search'),
    'in_categories' => t('in_categories'),
    'from_blog' => t('from_blog'),
    'blog' => t('blog'),
    'article_preview' => t('article_preview'),
    'quick_preview_of' => t('quick_preview_of'),
    'close' => t('close'),
    'copy_link' => t('copy_link'),
    'share_article' => t('share_article'),
    'bookmark' => t('bookmark'),
    'open_in_new_tab' => t('open_in_new_tab'),
    'no_results_found' => t('no_results_found'),
    'try_adjusting_search' => t('try_adjusting_search'),
    'no_articles_available' => t('no_articles_available'),
    'link_copied' => t('link_copied'),
    'bookmarked' => t('bookmarked'),
    'categories' => t('categories'),
    'searching_within' => t('searching_within')
];

// Merge site data with block data
$blockData = array_merge($blockData, $siteData);

// Merge any additional data passed to the snippet
if (isset($additionalData) && is_array($additionalData)) {
    $blockData = array_merge($blockData, $additionalData);
}

// Debug output (remove in production)
// error_log("Block data for $blockId: " . json_encode($blockData));
?>

<script>
window.blockData = window.blockData || {};
window.blockData['<?= $blockId ?>'] = <?= json_encode($blockData) ?>;
console.log('Block data for <?= $blockId ?>:', <?= json_encode($blockData) ?>);
</script>