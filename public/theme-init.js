// Applies the saved theme before React renders, so the page never flashes the wrong theme.
// Kept as an external file (not an inline <script>) so the Content-Security-Policy can forbid inline scripts.
;(function () {
  try {
    var theme = localStorage.getItem('theme') || 'system'
    var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  } catch {
    // Storage unavailable (private mode...): keep the light theme
  }
})()
