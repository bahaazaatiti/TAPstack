<?php snippet('header') ?>

<main>
  <?= $page->header()->toBlocks() ?>
  <?= $page->blocks()->toBlocks() ?>
  <br><br><br><br>
  <?= $page->footer()->toBlocks() ?>
</main>

<?php snippet('footer') ?>
