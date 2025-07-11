<!DOCTYPE html>
<html lang="<?= $kirby->language()?->code() ?? 'en' ?>">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kirby Vite Basic</title>
  <script>
    // Prevent flash of wrong theme - inline for immediate execution
    (function() {
      // Theme management
      const themeStorageKey = 'vite-ui-theme'
      const theme = localStorage.getItem(themeStorageKey) || 'system'
      const root = document.documentElement
      
      function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      
      function applyTheme(theme) {
        root.classList.remove('light', 'dark')
        if (theme === 'system') {
          root.classList.add(getSystemTheme())
        } else {
          root.classList.add(theme)
        }
      }
      
      applyTheme(theme)
    })()
  </script>
  <?php if (option('debug')): ?>
    <script type="module">
      import RefreshRuntime from 'http://localhost:5173/@react-refresh'
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
  <?php endif ?>
  <?= vite()->js('index.tsx') ?>
  <?= vite()->css('index.tsx') ?>
</head>
<body class="<?= $kirby->language()?->direction() ?? 'ltr' ?>">