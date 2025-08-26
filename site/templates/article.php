<?php snippet('header') ?>

<main>
  <!-- Comp582 block for header/navigation -->
  <div id="comp582-header" class="comp582-container"></div>
  <script>
    window.blockData = window.blockData || {};
    window.blockData['comp582-header'] = {
      "logo": [],
      "logotext": "TAP",
      "shownavigation": "true",
      "languages": [
        {"value": "en", "label": "English"},
        {"value": "ar", "label": "العربية"}
      ],
      "defaultlanguage": "en",
      "showthemetoggle": "true",
      "showlanguageselector": "true",
      "showusermenu": "true",
      "sitepages": [
        <?php
        $pages = [];
        foreach (site()->children()->listed() as $sitePage) {
          $pages[] = json_encode([
            'title' => $sitePage->title()->toString(),
            'url' => $sitePage->url(),
            'slug' => $sitePage->slug(),
            'isActive' => $sitePage->isActive()
          ]);
        }
        echo implode(',', $pages);
        ?>
      ],
      "site": {
        "title": "<?= site()->title()->toString() ?>",
        "url": "<?= site()->url() ?>",
        "language": "<?= kirby()->language() ? kirby()->language()->code() : 'en' ?>"
      }
    };
  </script>

  <!-- Article content with shadcn design -->
  <article class="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
    <!-- Article Header -->
    <header class="mb-8 space-y-4">
      <!-- Category Badge -->
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <?= $page->category() ?>
        </span>
      </div>
      
      <!-- Title -->
      <h1 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        <?= $page->title() ?>
      </h1>
      
      <!-- Meta Information -->
      <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time><?= $page->date()->toDate('M j, Y') ?></time>
        </div>
        
        <div class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><?= $page->readTime() ?> min read</span>
        </div>
        
        <?php if($page->author()->isNotEmpty()): ?>
        <div class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>By <?= $page->author() ?></span>
        </div>
        <?php endif ?>
      </div>
      
      <!-- Description if available -->
      <?php if($page->description()->isNotEmpty()): ?>
      <p class="text-lg text-muted-foreground leading-relaxed">
        <?= $page->description() ?>
      </p>
      <?php endif ?>
    </header>

    <!-- Featured Image -->
    <?php if($page->featuredImage()->isNotEmpty()): ?>
    <?php $featuredImg = $page->featuredImage()->toFile(); ?>
    <?php if($featuredImg): ?>
    <div class="mb-8 overflow-hidden rounded-lg border">
      <img
        src="<?= $featuredImg->url() ?>"
        alt="<?= $featuredImg->alt()->value() ?: $page->title() ?>"
        class="w-full h-auto object-cover"
        style="aspect-ratio: 16/9;"
      />
    </div>
    <?php endif ?>
    <?php endif ?>

    <!-- Article Content -->
    <div class="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-extrabold prose-h1:lg:text-5xl prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0 prose-h3:text-2xl prose-h3:font-semibold prose-h4:text-xl prose-h4:font-semibold prose-p:leading-7 prose-p:[&:not(:first-child)]:mt-6 prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-pre:overflow-x-auto prose-ol:mt-6 prose-ol:ml-6 prose-ol:list-decimal prose-ol:[&>li]:mt-2 prose-ul:mt-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2 prose-img:rounded-md prose-img:border prose-lead:text-xl prose-lead:text-muted-foreground">
      <?= $page->text()->kirbytext() ?>
    </div>

    <!-- Tags -->
    <?php if($page->tags()->isNotEmpty()): ?>
    <div class="mt-8 pt-6 border-t">
      <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-muted-foreground">Tags:</span>
        <?php foreach($page->tags()->split() as $tag): ?>
        <span class="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          <?= $tag ?>
        </span>
        <?php endforeach ?>
      </div>
    </div>
    <?php endif ?>

    <!-- Navigation -->
    <div class="mt-12 pt-8 border-t">
      <div class="flex items-center justify-between">
        <!-- Back to blog -->
        <a 
          href="<?= $page->parent()->url() ?>" 
          class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </a>
        
        <!-- Share button placeholder -->
        <button class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  </article>

  <!-- Footer block -->
  <div id="footer-main" class="footer-container"></div>
  <script>
    window.blockData = window.blockData || {};
    window.blockData['footer-main'] = {
      "name": "",
      "logo": [],
      "columns": [],
      "copyright": "© 2025 The Alawite Project. All rights reserved",
      "policies": [],
      "showmodetoggle": "true"
    };
  </script>
</main>

<?php snippet('footer') ?>
