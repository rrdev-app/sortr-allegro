function checkAndApplySort() {
  chrome.storage.local.get(['defaultSort'], (result) => {
    const currentMode = result.defaultSort || 'p';
    if (currentMode === 't') return;

    const url = new URL(window.location.href);

    // Omijamy pojedyncze oferty, koszyk, checkout, logowanie itp.
    if (url.pathname.includes('/oferta/') || 
        url.pathname.startsWith('/koszyk') || 
        url.pathname.startsWith('/zamowienie') || 
        url.pathname.startsWith('/moje-allegro')) {
      return;
    }

    // Sprawdzamy czy strona zawiera listę produktów (wyszukiwanie lub kategorie)
    const isListingPage = url.searchParams.has('string') || 
                          url.pathname.includes('/kategoria/') || 
                          url.pathname.includes('/dzial/') ||
                          document.querySelector('[data-role="sort-select"], select[aria-label*="sort"]') !== null;

    if (isListingPage && url.searchParams.get('order') !== currentMode) {
      url.searchParams.set('order', currentMode);
      window.location.replace(url.toString());
    }
  });
}

// Uruchomienie przy wejściu
checkAndApplySort();

// Nasłuchiwanie na nawigację wewnętrzną SPA (zmiany URL bez przeładowania strony)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    checkAndApplySort();
  }
}).observe(document, { subtree: true, childList: true });