(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('promptport-theme'); } catch {}
  function apply(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector('#theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.querySelector('span').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }
  apply(saved === 'light' || saved === 'dark' ? saved : system.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('#theme-toggle').addEventListener('click', () => {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(saved);
      try { localStorage.setItem('promptport-theme', saved); } catch {}
    });
  });
  system.addEventListener('change', e => { if (saved !== 'light' && saved !== 'dark') apply(e.matches ? 'dark' : 'light'); });
})();
