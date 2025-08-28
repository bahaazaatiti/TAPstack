<?php 
// AuthorBox block snippet - displays author information
$selectedAuthor = null;

if ($block->author()->isNotEmpty()) {
    $authorUser = $block->author()->toUser();
    if ($authorUser) {
        // Get author avatar
        $authorAvatar = null;
        if ($authorUser->avatar()) {
            $avatarFile = $authorUser->avatar();
            if ($avatarFile) {
                $authorAvatar = [
                    'url' => $avatarFile->url(),
                    'alt' => $authorUser->name()->value()
                ];
            }
        }
        
        $selectedAuthor = [
            'name' => $authorUser->name()->value(),
            'position' => $authorUser->position()->value() ?: '',
            'affiliation' => $authorUser->affiliation()->value() ?: '',
            'bio' => $authorUser->bio()->value() ?: '',
            'avatar' => $authorAvatar,
            'website' => $authorUser->website()->value() ?: '',
            'twitter' => $authorUser->twitter()->value() ?: '',
            'linkedin' => $authorUser->linkedin()->value() ?: '',
            'facebook' => $authorUser->facebook()->value() ?: ''
        ];
    }
}

// Prepare block data
$blockData = [
    'author' => $selectedAuthor,
    'showbio' => $block->showbio()->toBool(),
    'showsocial' => $block->showsocial()->toBool(),
    'customtitle' => $block->customtitle()->value()
];
?>

<div id="authorbox-<?= $block->id() ?>" class="authorbox-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['authorbox-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
