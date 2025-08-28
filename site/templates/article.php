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

  <!-- Article block -->
  <div id="article-main" class="article-container"></div>
  <script>
    window.blockData = window.blockData || {};
    window.blockData['article-main'] = {
      "title": "<?= esc($page->title()) ?>",
      "description": "<?= esc($page->description()) ?>",
      "category": "<?= esc($page->parent()->title()) ?>",
      "tags": <?= json_encode($page->tags()->split(',')) ?>,
      "readTime": <?= $page->readTime()->or(5)->toInt() ?>,
      "date": "<?= $page->date()->toDate('M j, Y') ?>",
      "parentTitle": "<?= esc($page->parent()->title()) ?>",
      "parentUrl": "<?= $page->parent()->url() ?>",
      "featuredImage": <?php 
        if ($page->featuredImage()->isNotEmpty() && $featuredImg = $page->featuredImage()->toFile()) {
          echo json_encode([
            'url' => $featuredImg->url(),
            'alt' => $featuredImg->alt()->or($page->title())
          ]);
        } else {
          echo 'null';
        }
      ?>,
      "content": <?= json_encode((string)$page->text()->kirbytext()) ?>,
      "author": <?php 
        if ($page->author()->isNotEmpty() && $author = $page->author()->toUser()) {
          echo json_encode([
            'name' => (string)$author->name(),
            'position' => (string)$author->position(),
            'affiliation' => (string)$author->affiliation(),
            'bio' => (string)$author->bio(),
            'avatar' => $author->avatar() ? [
              'url' => $author->avatar()->crop(48, 48)->url(),
              'alt' => (string)$author->name()
            ] : null,
            'website' => (string)$author->website(),
            'twitter' => (string)$author->twitter(),
            'linkedin' => (string)$author->linkedin(),
            'facebook' => (string)$author->facebook()
          ]);
        } else {
          echo 'null';
        }
      ?>,
      "pdfFiles": <?= json_encode($page->files()->filterBy('extension', 'pdf')->map(function($file) {
        return [
          'url' => $file->url(),
          'title' => $file->filename(),
          'size' => $file->niceSize()
        ];
      })->values()) ?>,
      "siteTitle": "<?= esc($site->title()) ?>",
      "currentUrl": "<?= $page->url() ?>"
    };
  </script>
<br><br><br><br>
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
