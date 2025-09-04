<?php 
// Extract data from Kirby's $block object
$cards = [];
foreach ($block->cards()->toStructure() as $card) {
    $image = null;
    if ($card->image()->isNotEmpty()) {
        $imageFile = $card->image()->toFile();
        if ($imageFile) {
            $image = [
                'url' => $imageFile->url(),
                'alt' => $imageFile->alt()->value() ?: $card->title()->value(),
                'width' => $imageFile->width(),
                'height' => $imageFile->height()
            ];
        }
    }
    
    $features = [];
    foreach ($card->features()->toStructure() as $feature) {
        $features[] = [
            'icon' => $feature->icon()->value(),
            'text' => $feature->text()->value()
        ];
    }
    
    $cards[] = [
        'title' => $card->title()->value(),
        'image' => $image,
        'features' => $features,
        'buttontext' => $card->buttontext()->value(),
        'buttonurl' => $card->buttonurl()->value(),
        'buttonexternal' => $card->buttonexternal()->toBool()
    ];
}

// Extract FAQ data
$faqs = [];
if ($block->faqs()->isNotEmpty()) {
    foreach ($block->faqs()->toStructure() as $faq) {
        $faqs[] = [
            'question' => $faq->question()->value(),
            'answer' => $faq->answer()->value()
        ];
    }
}

// Prepare block data
$blockData = [
    'title' => $block->title()->value(),
    'subtitle' => $block->subtitle()->value(),
    'cards' => $cards,
    'showfaq' => $block->showfaq()->toBool(),
    'faqtitle' => $block->faqtitle()->value(),
    'faqs' => $faqs
];
?>

<div id="features03-<?= $block->id() ?>" class="features03-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['features03-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
