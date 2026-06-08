/**
 * Global Brochure Download Modal Component
 * Loads HTML and CSS files dynamically and hooks up brochure triggers.
 */

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject CSS stylesheet dynamically if not already loaded
    const cssPath = 'CSS/brochure-modal.css';
    let cssLoaded = Promise.resolve();

    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      cssLoaded = new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Proceed even if CSS fails to load
        document.head.appendChild(link);
      });
    }

    // 2. Fetch and Inject the HTML modal structure
    const htmlFetched = fetch('brochure-modal.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load brochure modal HTML file.');
        }
        return response.text();
      });

    // Wait for both CSS and HTML to be ready before appending to prevent flash of unstyled HTML (FOUC)
    Promise.all([cssLoaded, htmlFetched])
      .then(([_, html]) => {
        // Append modal HTML to document body
        const containerDiv = document.createElement('div');
        containerDiv.innerHTML = html.trim();
        const modalElement = containerDiv.firstChild;
        document.body.appendChild(modalElement);
        
        // Initialize triggers and events
        initializeModalControls();
      })
      .catch(error => {
        console.error('Error initializing brochure modal:', error);
      });

    /**
     * Set up all triggers and handlers for the brochure modal
     */
    function initializeModalControls() {
      const modal = document.getElementById('brochureModal');
      const closeBtn = document.getElementById('brochureModalClose');
      const form = document.getElementById('brochure-submit-form');

      if (!modal) return;

      // Opens the modal
      function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Set focus to the first input field
        const firstInput = form ? form.querySelector('input') : null;
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 150);
        }
      }

      // Closes the modal
      function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
      }

      // 3. Listen for clicks on brochure triggers globally (Event Delegation)
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.download-brochure-btn') || 
                        e.target.closest('[href="#brochure"]') ||
                        e.target.closest('[data-trigger="brochure"]');
        
        if (trigger) {
          e.preventDefault();
          openModal();
        }
      });

      // 4. Close on 'X' button click
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal();
        });
      }

      // 5. Close on backdrop overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // 6. Close on Escape key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
        }
      });

      // 7. Form submission feedback animation
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const submitBtn = form.querySelector('.form-submit-btn');
          if (!submitBtn) return;

          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;

          // Simulate sending message
          setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            // Apply green success color matching design tokens
            submitBtn.style.backgroundColor = '#2e7d32'; 
            submitBtn.style.borderColor = '#2e7d32';
            submitBtn.style.color = '#ffffff';

            setTimeout(() => {
              form.reset();
              submitBtn.textContent = originalText;
              submitBtn.style.backgroundColor = '';
              submitBtn.style.borderColor = '';
              submitBtn.style.color = '';
              submitBtn.disabled = false;
              closeModal();
            }, 2000);
          }, 1500);
        });
      }
    }
  });
})();
