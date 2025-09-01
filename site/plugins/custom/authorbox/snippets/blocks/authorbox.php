<?php 
// AuthorBox block snippet - displays author information with enhanced features
$selectedAuthor = null;
$authorArticles = [];
$publicationStats = null;

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
        
        // Fetch author's articles from across the site
        $authorUuid = $authorUser->uuid()->toString();
        $allArticles = site()->index()
            ->filterBy('intendedTemplate', 'article')
            ->filter(function($page) use ($authorUuid) {
                $pageAuthor = $page->author()->toUser();
                return $pageAuthor && $pageAuthor->uuid()->toString() === $authorUuid;
            })
            ->sortBy('date', 'desc');
        
        // Process articles for timeline
        foreach ($allArticles->limit(10) as $article) {
            // Get featured image if available
            $featuredImage = null;
            if ($article->featuredImage()->isNotEmpty()) {
                $imageFile = $article->featuredImage()->toFile();
                if ($imageFile) {
                    $featuredImage = [
                        'url' => $imageFile->url(),
                        'alt' => $imageFile->alt()->value() ?: $article->title()->value()
                    ];
                }
            }
            
            $authorArticles[] = [
                'title' => $article->title()->value(),
                'url' => $article->url(),
                'date' => $article->date()->toDate('Y-m-d'),
                'dateFormatted' => $article->date()->toDate('M j, Y'),
                'category' => $article->category()->value() ?: 'Article',
                'description' => $article->description()->value() ?: $article->text()->excerpt(150),
                'readTime' => $article->readTime()->value() ?: '5',
                'featuredImage' => $featuredImage
            ];
        }
        
        // Calculate publication statistics
        $categories = $allArticles->pluck('category', ',', true);
        $publicationStats = [
            'totalArticles' => $allArticles->count(),
            'recentArticles' => $allArticles->filterBy('date', '>', date('Y-m-d', strtotime('-30 days')))->count(),
            'categoriesCount' => count($categories),
            'averageReadTime' => round($allArticles->avg('readTime') ?: 5),
            'firstPublication' => $allArticles->last() ? $allArticles->last()->date()->toDate('Y-m-d') : null,
            'lastPublication' => $allArticles->first() ? $allArticles->first()->date()->toDate('Y-m-d') : null
        ];
        
        // Process expertise tags
        $expertiseTags = [];
        if ($authorUser->expertise()->isNotEmpty()) {
            $expertiseTags = $authorUser->expertise()->split(',');
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
            'facebook' => $authorUser->facebook()->value() ?: '',
            'email' => $authorUser->email(),
            'expertise' => $expertiseTags
        ];
    }
}

// Prepare block data
$blockData = [
    'author' => $selectedAuthor,
    'showbio' => $block->showbio()->toBool(),
    'showsocial' => $block->showsocial()->toBool(),
    'customtitle' => $block->customtitle()->value(),
    'articles' => $authorArticles,
    'publicationStats' => $publicationStats
];
?>

<div id="authorbox-<?= $block->id() ?>" class="authorbox-container"></div>

<script>
window.blockData = window.blockData || {};
window.blockData['authorbox-<?= $block->id() ?>'] = <?= json_encode($blockData) ?>;
</script>
