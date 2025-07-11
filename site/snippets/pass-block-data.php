<?php

/**
 * //TODO: remove debugging logs in production
 * Reusable snippet to pass block data to JavaScript with enhanced image support
 * 
 * @param Kirby\Cms\Block $block - The block object
 * @param string $blockType - The block type (e.g., 'hero', 'navbar')
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

// Debug output (remove in production)
// error_log("Block data for $blockId: " . json_encode($blockData));
?>

<script>
window.blockData = window.blockData || {};
window.blockData['<?= $blockId ?>'] = <?= json_encode($blockData) ?>;
console.log('Block data for <?= $blockId ?>:', <?= json_encode($blockData) ?>);
</script>