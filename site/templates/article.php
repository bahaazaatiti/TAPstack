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

  <!-- Hero Section with Featured Image Background -->
  <?php if($page->featuredImage()->isNotEmpty()): ?>
  <?php $featuredImg = $page->featuredImage()->toFile(); ?>
  <?php if($featuredImg): ?>
  <div class="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="<?= $featuredImg->url() ?>"
        alt="<?= $featuredImg->alt()->value() ?: $page->title() ?>"
        class="h-full w-full object-cover"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
    </div>
    
    <!-- Hero Content -->
    <div class="relative flex h-full items-center justify-center py-8 md:py-16 lg:py-20">
      <div class="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto space-y-3 md:space-y-4 lg:space-y-6 text-primary-foreground text-center drop-shadow-lg">
          <!-- Breadcrumb - Parent Blog -->
          <nav class="flex items-center justify-center gap-2 text-sm text-primary-foreground/80">
            <a href="<?= $page->parent()->url() ?>" class="hover:text-primary-foreground transition-colors">
              <?= $page->parent()->title() ?>
            </a>
          </nav>
          
          <!-- Meta Information -->
          <div class="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm text-primary-foreground/90">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><?= $page->readTime() ?> min read</span>
            </div>
            
            <div class="text-primary-foreground/60">•</div>
            
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time><?= $page->date()->toDate('M j, Y') ?></time>
            </div>
          </div>
          
          <!-- Title -->
          <h1 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight leading-tight text-primary-foreground drop-shadow-xl px-4">
            <?= $page->title() ?>
          </h1>
          
          <!-- Description -->
          <?php if($page->description()->isNotEmpty()): ?>
          <div class="pt-4 md:pt-6">
            <p class="text-base md:text-lg lg:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto px-4">
              <?= $page->description() ?>
            </p>
          </div>
          <?php endif ?>
          
          <!-- Category and Tags -->
          <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3 pt-4">
            <!-- Category Badge -->
            <span class="inline-flex items-center rounded-full bg-primary-foreground/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-primary-foreground border border-primary-foreground/30">
              <?= $page->category() ?>
            </span>
            
            <!-- Tags -->
            <?php if($page->tags()->isNotEmpty()): ?>
            <?php foreach($page->tags()->split() as $tag): ?>
            <span class="inline-flex items-center rounded-full bg-primary-foreground/10 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-primary-foreground/90 border border-primary-foreground/20">
              <?= $tag ?>
            </span>
            <?php endforeach ?>
            <?php endif ?>
          </div>
        </div>
      </div>
    </div>
  </div>
  <?php endif ?>
  <?php endif ?>

  <!-- Main Content Area -->
  <div class="container pt-20 px-4 md:px-6 lg:px-8">
    <div class="relative mx-auto w-full max-w-5xl items-start justify-between gap-20 xl:flex">
      
      <!-- Table of Contents Sidebar (Desktop Only) -->
      <div class="hidden xl:block bg-background top-20 flex-1 pb-10 xl:sticky xl:pb-0">
        <div class="text-xl font-medium leading-snug">Chapters</div>
        <nav class="flex flex-col gap-2 pl-2 pt-2" id="toc">
          <!-- TOC will be populated by JavaScript -->
        </nav>
      </div>
      
      <!-- Content Area -->
      <div class="flex w-full xl:max-w-[40rem] max-w-4xl mx-auto flex-col gap-10">
        
        <!-- Author Info at Top -->
        <?php if($page->author()->isNotEmpty() && $author = $page->author()->toUser()): ?>
        <div class="flex items-center gap-2.5">
          <!-- Author Avatar -->
          <?php if ($avatar = $author->avatar()): ?>
          <span class="relative flex shrink-0 overflow-hidden rounded-full size-12 border">
            <img
              src="<?= $avatar->crop(48, 48)->url() ?>"
              alt="<?= $author->name() ?>"
              class="aspect-square size-full"
            />
          </span>
          <?php else: ?>
          <span class="relative flex shrink-0 overflow-hidden rounded-full size-12 border bg-primary/10 items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <?php endif ?>
          
          <!-- Author Info -->
          <div>
            <div class="text-sm font-medium leading-normal"><?= $author->name() ?></div>
            <?php if($author->position()->isNotEmpty() || $author->affiliation()->isNotEmpty()): ?>
            <div class="text-muted-foreground text-sm font-normal leading-normal">
              <?php if($author->position()->isNotEmpty()): ?>
                <?= $author->position() ?>
              <?php endif ?>
              <?php if($author->position()->isNotEmpty() && $author->affiliation()->isNotEmpty()): ?>
                &amp; 
              <?php endif ?>
              <?php if($author->affiliation()->isNotEmpty()): ?>
                <?= $author->affiliation() ?>
              <?php endif ?>
            </div>
            <?php endif ?>
          </div>
        </div>
        <?php endif ?>
        
        <!-- Article Content -->
        <article class="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h1:first:mt-0 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:first:mt-0 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:first:mt-0 prose-p:mb-6 prose-p:leading-relaxed prose-p:last:mb-0 prose-strong:font-semibold prose-em:italic prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-img:rounded-lg prose-img:my-6">
          <?php
          // Get the content and use both markdown() and kirbytext() for full compatibility
          // This ensures markdown headers work AND KirbyTags work
          $content = $page->text()->markdown()->kirbytext();
          echo $content;
          ?>
        </article>

        <!-- PDF Files Section -->
        <?php 
        $pdfFiles = $page->files()->filterBy('extension', 'pdf');
        if($pdfFiles->count() > 0): 
        ?>
        <div class="space-y-6">
          <h3 class="text-xl font-semibold">Documents</h3>
          <?php foreach($pdfFiles as $pdf): ?>
          <div class="border rounded-lg p-4 bg-muted/50">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 8.12,16.5 8.91,15.69C9.7,14.88 10.58,14.26 11.5,13.82C11.2,13.38 10.91,12.94 10.65,12.5C9.91,13.05 9.19,13.65 8.5,14.32C7.81,15 7.19,15.72 6.66,16.47C6.66,16.47 6.66,16.47 6.66,16.47C6.66,16.47 6.66,16.47 6.66,16.47C6.66,16.47 6.66,16.47 6.66,16.47C6.66,16.47 6.66,16.47 6.66,16.47M18.85,16.47C18.32,15.72 17.7,15 17,14.32C16.31,13.65 15.6,13.05 14.85,12.5C14.6,12.94 14.31,13.38 14,13.82C14.92,14.26 15.8,14.88 16.59,15.69C17.38,16.5 18,17.38 18.43,18.28M12,10.5C12.83,10.5 13.5,9.83 13.5,9C13.5,8.17 12.83,7.5 12,7.5C11.17,7.5 10.5,8.17 10.5,9C10.5,9.83 11.17,10.5 12,10.5Z"/>
                </svg>
                <div>
                  <h4 class="font-medium"><?= $pdf->filename() ?></h4>
                  <?php if($pdf->caption()->isNotEmpty()): ?>
                  <p class="text-sm text-muted-foreground"><?= $pdf->caption() ?></p>
                  <?php endif ?>
                </div>
              </div>
              <a 
                href="<?= $pdf->url() ?>" 
                target="_blank" 
                class="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a>
            </div>
            
            <!-- PDF Embed -->
            <div class="w-full h-96 border rounded bg-white">
              <embed 
                src="<?= $pdf->url() ?>#toolbar=1&navpanes=1&scrollbar=1" 
                type="application/pdf" 
                width="100%" 
                height="100%"
                class="rounded"
              />
            </div>
          </div>
          <?php endforeach ?>
        </div>
        <?php endif ?>

        <!-- Author Details Box at Bottom -->
        <?php if($page->author()->isNotEmpty() && $author = $page->author()->toUser()): ?>
        <div class="bg-muted rounded-lg p-5">
          <div class="flex items-center gap-2.5 mb-4">
            <!-- Author Avatar -->
            <?php if ($avatar = $author->avatar()): ?>
            <span class="relative flex shrink-0 overflow-hidden rounded-full size-12 border">
              <img
                src="<?= $avatar->crop(48, 48)->url() ?>"
                alt="<?= $author->name() ?>"
                class="aspect-square size-full"
              />
            </span>
            <?php else: ?>
            <span class="relative flex shrink-0 overflow-hidden rounded-full size-12 border bg-primary/10 items-center justify-center">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <?php endif ?>
            
            <!-- Author Info -->
            <div>
              <div class="text-sm font-medium leading-normal"><?= $author->name() ?></div>
              <?php if($author->position()->isNotEmpty() || $author->affiliation()->isNotEmpty()): ?>
              <div class="text-muted-foreground text-sm font-normal leading-normal">
                <?php if($author->position()->isNotEmpty()): ?>
                  <?= $author->position() ?>
                <?php endif ?>
                <?php if($author->position()->isNotEmpty() && $author->affiliation()->isNotEmpty()): ?>
                  &amp; 
                <?php endif ?>
                <?php if($author->affiliation()->isNotEmpty()): ?>
                  <?= $author->affiliation() ?>
                <?php endif ?>
              </div>
              <?php endif ?>
            </div>
          </div>

          <?php if($author->bio()->isNotEmpty()): ?>
          <p class="mb-4"><?= $author->bio() ?></p>
          <?php endif ?>

          <!-- Social Links -->
          <div class="flex items-center gap-2.5">
            <?php if($author->website()->isNotEmpty()): ?>
            <a 
              href="<?= $author->website() ?>" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
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
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
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
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
              title="LinkedIn"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <?php endif ?>

            <?php if($author->Facebook()->isNotEmpty()): ?>
            <a 
              href="<?= $author->Facebook() ?>" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9"
              title="Facebook"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <?php endif ?>
          </div>
        </div>
        <?php endif ?>

        <!-- Navigation -->
        <div class="flex items-center justify-between pt-8 border-t">
          <!-- Back to blog -->
          <a 
            href="<?= $page->parent()->url() ?>" 
            class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg class="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to <?= $page->parent()->title() ?>
          </a>
          
          <!-- Share button -->
          <button class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </button>
        </div>
        
      </div>
    </div>
  </div>

  <!-- Table of Contents Script -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const tocContainer = document.getElementById('toc');
      const headings = document.querySelectorAll('article h1, article h2, article h3');
      
      if (headings.length === 0) {
        tocContainer.innerHTML = '<p class="text-xs text-muted-foreground">No headings found</p>';
        return;
      }
      
      headings.forEach((heading, index) => {
        // Create anchor ID if it doesn't exist
        if (!heading.id) {
          heading.id = 'heading-' + (index + 1);
        }
        
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.className = 'text-muted-foreground block text-sm font-medium leading-normal transition duration-300 hover:text-primary';
        
        // Highlight first heading
        if (index === 0) {
          a.className += ' lg:bg-muted lg:!text-primary lg:rounded-md lg:p-2 lg:font-bold';
        }
        
        // Smooth scroll
        a.addEventListener('click', function(e) {
          e.preventDefault();
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Update active state
          document.querySelectorAll('#toc a').forEach(link => {
            link.className = 'text-muted-foreground block text-sm font-medium leading-normal transition duration-300 hover:text-primary';
          });
          a.className += ' lg:bg-muted lg:!text-primary lg:rounded-md lg:p-2 lg:font-bold';
          
          history.pushState(null, null, '#' + heading.id);
        });
        
        tocContainer.appendChild(a);
      });
    });
  </script>

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
