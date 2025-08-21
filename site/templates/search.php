<?php snippet('header') ?>

<main>
  <?= $page->header()->toBlocks() ?>
  <?= $page->blocks()->toBlocks() ?>
  <?= $page->footer()->toBlocks() ?>
</main>

<?php snippet('footer') ?>
