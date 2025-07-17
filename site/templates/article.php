<?php snippet('header') ?>

<main>
  <!-- Comp582 block for header/navigation -->
  <div id="comp582-header" class="comp582-container"></div>
  <script>
    window.blockData = window.blockData || {};
    window.blockData['comp582-header'] = {};
  </script>

  <!-- Article content -->
  <article class="max-w-4xl mx-auto py-10 lg:py-16 px-6 xl:px-0">
    <header class="mb-8">
      <div class="mb-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          <?= $page->category() ?>
        </span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight mb-4"><?= $page->title() ?></h1>
      <div class="flex items-center gap-6 text-muted-foreground text-sm">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <?= $page->date()->toDate('M j, Y') ?>
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <?= $page->readTime() ?> min read
        </div>
        <?php if($page->author()->isNotEmpty()): ?>
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <?= $page->author() ?>
        </div>
        <?php endif ?>
      </div>
    </header>

    <div class="prose prose-lg max-w-none dark:prose-invert">
      <?= $page->text()->kirbytext() ?>
    </div>

    <!-- Back to blog link -->
    <div class="mt-12 pt-8 border-t">
      <a href="<?= $page->parent()->url() ?>" class="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Blog
      </a>
    </div>
  </article>

  <!-- Footer block -->
  <div id="footer-main" class="footer-container"></div>
  <script>
    window.blockData = window.blockData || {};
    window.blockData['footer-main'] = {};
  </script>
</main>

<?php snippet('footer') ?>
