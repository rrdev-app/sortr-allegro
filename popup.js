document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('sortSelect');
  const statusMsg = document.getElementById('statusMsg');

  function applySorting(mode) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0 || !tabs[0].url) return;

      const tab = tabs[0];
      if (!tab.url.includes('allegro.pl')) {
        if (statusMsg) statusMsg.textContent = 'Otwórz najpierw Allegro';
        return;
      }

      const url = new URL(tab.url);
      if (mode === 't') {
        url.searchParams.delete('order');
      } else {
        url.searchParams.set('order', mode);
      }

      chrome.tabs.update(tab.id, { url: url.toString() });

      if (statusMsg) {
        statusMsg.textContent = '✓ Zastosowano i odświeżono!';
        setTimeout(() => {
          statusMsg.textContent = '';
        }, 2000);
      }
    });
  }

  chrome.storage.local.get(['defaultSort'], (result) => {
    const current = result.defaultSort || 'p';
    select.value = current;
  });

  select.addEventListener('change', () => {
    const selectedMode = select.value;
    chrome.storage.local.set({ defaultSort: selectedMode }, () => {
      applySorting(selectedMode);
    });
  });
});