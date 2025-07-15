<?php snippet('header') ?>

<main>
  <?= $page->header()->toBlocks() ?>
  <?= $page->content()->toBlocks() ?>
  <?= $page->footer()->toBlocks() ?>
</main>

<?php snippet('footer') ?>