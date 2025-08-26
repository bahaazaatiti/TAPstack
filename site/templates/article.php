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
        
        <?php if($page->author()->isNotEmpty() && $author = $page->author()->toUser()): ?>
        <div class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>By <?= $author->name() ?></span>
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

    <!-- Author Details -->
    <?php if($page->author()->isNotEmpty() && $author = $page->author()->toUser()): ?>
    <div class="mt-8 pt-6 border-t">
      <div class="bg-card border rounded-lg p-6">
        <div class="flex items-start gap-4">
          <!-- Author Avatar -->
          <?php if ($avatar = $author->avatar()): ?>
          <div class="flex-shrink-0">
            <img
              src="<?= $avatar->crop(80, 80)->url() ?>"
              alt="<?= $author->name() ?>"
              class="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <?php else: ?>
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <?php endif ?>
          
          <!-- Author Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-foreground"><?= $author->name() ?></h3>
            
            <?php if($author->position()->isNotEmpty() || $author->affiliation()->isNotEmpty()): ?>
            <p class="text-sm text-muted-foreground mt-1">
              <?php if($author->position()->isNotEmpty()): ?>
                <?= $author->position() ?>
              <?php endif ?>
              <?php if($author->position()->isNotEmpty() && $author->affiliation()->isNotEmpty()): ?>
                at 
              <?php endif ?>
              <?php if($author->affiliation()->isNotEmpty()): ?>
                <?= $author->affiliation() ?>
              <?php endif ?>
            </p>
            <?php endif ?>

            <?php if($author->bio()->isNotEmpty()): ?>
            <p class="text-sm text-muted-foreground mt-2">
              <?= $author->bio() ?>
            </p>
            <?php endif ?>

            <?php if($author->expertise()->isNotEmpty()): ?>
            <div class="mt-3">
              <span class="text-xs font-medium text-muted-foreground">Expertise:</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <?php foreach($author->expertise()->split() as $skill): ?>
                <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <?= $skill ?>
                </span>
                <?php endforeach ?>
              </div>
            </div>
            <?php endif ?>

            <!-- Social Links -->
            <div class="flex items-center gap-3 mt-3">
              <?php if($author->website()->isNotEmpty()): ?>
              <a 
                href="<?= $author->website() ?>" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="Website"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <?php endif ?>

              <?php if($author->twitter()->isNotEmpty()): ?>
              <a 
                href="https://twitter.com/<?= $author->twitter() ?>" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="Twitter/X"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <?php endif ?>

              <?php if($author->linkedin()->isNotEmpty()): ?>
              <a 
                href="<?= $author->linkedin() ?>" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="LinkedIn"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <?php endif ?>

              <?php if($author->mastodon()->isNotEmpty()): ?>
              <a 
                href="<?= $author->mastodon() ?>" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="Mastodon"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>
                </svg>
              </a>
              <?php endif ?>
            </div>
          </div>
        </div>
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
