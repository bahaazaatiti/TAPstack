<?php 
// AuthorBox block snippet - uses pass-block-data.php with special author processing

$additionalData = [];

// Process author-specific data if an author is selected
if ($block->author()->isNotEmpty()) {
    $authorUser = $block->author()->toUser();
    if ($authorUser) {
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
        $authorArticles = [];
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
        
        $additionalData['articles'] = $authorArticles;
        $additionalData['publicationStats'] = $publicationStats;
    }
}
?>

<div id="authorbox-<?= $block->id() ?>" class="authorbox-container"></div>

<?php snippet('pass-block-data', ['block' => $block, 'blockType' => 'authorbox', 'additionalData' => $additionalData]) ?>
