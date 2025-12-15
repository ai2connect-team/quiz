// test
// Accessibility Fixes for ai2accesspilot.com (WCAG 1.4.3, 4.1.1, 4.1.2)
// Tested against issues from December 2025 scan

(function () {
    // Helper: debounce
    function debounce(func, delay) {
        let timeout;
        return function () {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, arguments), delay);
        };
    }

    // Fix 1: Contrast - Cookie consent "Alle akzeptieren" button
    function fixContrast() {
        const button = document.querySelector('button:contains("Alle akzeptieren")') ||
                       document.querySelector('button.text-white.bg-[#00c2cb], button.rounded.text-sm.px-4.py-2');
        
        if (button && !button.dataset.wcagContrastFixed) {
            // Change background to recommended #00838a for >=4.5:1 contrast with white text
            button.style.backgroundColor = '#00838a';
            button.style.setProperty('background-color', '#00838a', 'important');
            
            // Optional: darker hover state
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#006d72';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#00838a';
            });
            
            button.dataset.wcagContrastFixed = 'true';
        }
    }

    // Fix 2: Duplicate IDs (zsiqscript) - Remove id from duplicates
    function fixDuplicateIds() {
        const scripts = document.querySelectorAll('script#zsiqscript');
        let seen = false;
        
        scripts.forEach(script => {
            if (!seen) {
                seen = true; // Keep the first one
            } else if (!script.dataset.wcagIdFixed) {
                script.removeAttribute('id');
                script.dataset.wcagIdFixed = 'true';
            }
        });
    }

    // Fix 3: Missing accessible name on Zoho close button
    function fixCloseButtonAria() {
        const closeBtn = document.querySelector('#hide-widget') ||
                         document.querySelector('em.siqico-close[role="button"], .zsiq-widget-close[role="button"]');
        
        if (closeBtn && !closeBtn.dataset.wcagAriaFixed) {
            // Add accessible name (German, matching site language)
            closeBtn.setAttribute('aria-label', 'Chat-Widget schließen');
            
            // Optional: add title as fallback
            closeBtn.setAttribute('title', 'Chat-Widget schließen');
            
            closeBtn.dataset.wcagAriaFixed = 'true';
        }
    }

    // Main apply function
    function applyAllFixes() {
        fixContrast();
        fixDuplicateIds();
        fixCloseButtonAria();
    }

    const debouncedApply = debounce(applyAllFixes, 500);

    // Initial run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyAllFixes, 1000); // Allow third-party scripts to load
        });
    } else {
        setTimeout(applyAllFixes, 1000);
    }

    // Observe for dynamic changes (e.g., Zoho widget loading late, cookie banner appearing)
    const observer = new MutationObserver(debouncedApply);
    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['id', 'style', 'class']
    });

    // Fallback periodic check for very late-loaded elements (Zoho can load async)
    const interval = setInterval(() => {
        applyAllFixes();
        // Stop after 30 seconds if everything is fixed
        if (document.querySelector('[data-wcag-contrast-fixed]') &&
            document.querySelectorAll('script#zsiqscript').length <= 1 &&
            document.querySelector('[data-wcag-aria-fixed]')) {
            clearInterval(interval);
        }
    }, 2000);

    setTimeout(() => clearInterval(interval), 30000);
})();
