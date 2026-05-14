
'use strict';

 
(function initProductGallery() {
  const mainImg  = document.getElementById('ph-active-img');
  const thumbsEl = document.getElementById('ph-thumbs');
  const prevBtn  = document.getElementById('ph-prev');
  const nextBtn  = document.getElementById('ph-next');
  if (!mainImg || !thumbsEl) return;

  const thumbBtns = Array.from(thumbsEl.querySelectorAll('.ph-thumb'));
  let activeIdx = 0;

   function switchTo(idx) {
    activeIdx = (idx + thumbBtns.length) % thumbBtns.length;
    const src = thumbBtns[activeIdx].dataset.src;
     mainImg.style.opacity = '0';
    setTimeout(function () {
      mainImg.src = src;
      mainImg.style.opacity = '1';
    }, 180);
    thumbBtns.forEach(function (btn, i) {
      btn.classList.toggle('active', i === activeIdx);
    });
  }

  /* Thumbnail clicks */
  thumbBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { switchTo(i); });
  });

  /* Prev / Next arrows */
  if (prevBtn) prevBtn.addEventListener('click', function () { switchTo(activeIdx - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { switchTo(activeIdx + 1); });

  /* Smooth fade via CSS transition */
  mainImg.style.transition = 'opacity 0.18s ease';
})();

 
(function initStickyHeader() {
  const stickyHeader = document.getElementById('sticky-header');
  const mainHeader   = document.getElementById('main-header');
  if (!stickyHeader || !mainHeader) return;

  let lastScrollY    = 0;
  let ticking        = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  function updateHeader() {
    const scrollY       = window.scrollY;
    const firstFoldEnd  = window.innerHeight;  
    const scrollingDown = scrollY > lastScrollY;

    if (scrollY > firstFoldEnd && scrollingDown) { 
      stickyHeader.classList.add('visible');
      stickyHeader.setAttribute('aria-hidden', 'false');
    } else if (!scrollingDown || scrollY <= firstFoldEnd) {
       
      stickyHeader.classList.remove('visible');
      stickyHeader.setAttribute('aria-hidden', 'true');
    }

    lastScrollY = scrollY;
    ticking     = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

 
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* 
   3. FAQ ACCORDION
     */
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', function () {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) {
            otherAnswer.style.display = 'none';
          }
        }
      });

      // Toggle current
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        answer.style.display = 'none';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        answer.style.display = 'block';
      }
    });
  });
})();


/*  
*/
(function initProcessTabs() {
  const tabs   = document.querySelectorAll('.process-tab');
  const panels = document.querySelectorAll('.process-panel');
  if (!tabs.length || !panels.length) return;

  
  const panelMap = {
    raw:       'panel-raw',
    extrusion: 'panel-extrusion',
    cooling:   'panel-cooling',
    sizing:    'panel-sizing',
    quality:   'panel-quality',
    marking:   'panel-marking',
    cutting:   'panel-cutting',
    packaging: 'panel-packaging'
  };

  const tabKeys = Object.keys(panelMap); // ordered list

  function activateTab(key) {
    tabs.forEach(function (t) {
      const isActive = t.dataset.tab === key;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive.toString());
    });
    panels.forEach(function (p) {
      p.classList.toggle('active', p.id === panelMap[key]);
    });
  }

  // Tab click
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab.dataset.tab);
    });
  });
 
  document.querySelectorAll('.process-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const activePanel = document.querySelector('.process-panel.active');
      if (!activePanel) return;
      const currentKey = Object.keys(panelMap).find(k => panelMap[k] === activePanel.id);
      const idx        = tabKeys.indexOf(currentKey);
      if (idx < tabKeys.length - 1) activateTab(tabKeys[idx + 1]);
    });
  });

  document.querySelectorAll('.process-prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const activePanel = document.querySelector('.process-panel.active');
      if (!activePanel) return;
      const currentKey = Object.keys(panelMap).find(k => panelMap[k] === activePanel.id);
      const idx        = tabKeys.indexOf(currentKey);
      if (idx > 0) activateTab(tabKeys[idx - 1]);
    });
  });
})();


 
(function initCarousel() {
  const wrapper = document.getElementById('carousel-wrapper');
  const track   = document.getElementById('carousel-track');
  const dotsEl  = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!wrapper || !track) return;

  const items     = Array.from(track.querySelectorAll('.carousel-item'));
  const totalItems = items.length;
  let currentIdx  = 0;
  let visibleCount = 4;   // default 4 on desktop

  // --- Build dots ---
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const pages = Math.ceil(totalItems / visibleCount);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className    = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i * visibleCount); });
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsEl) return;
    const dots  = dotsEl.querySelectorAll('.carousel-dot');
    const page  = Math.floor(currentIdx / visibleCount);
    dots.forEach(function (d, i) { d.classList.toggle('active', i === page); });
  }

   function getItemWidth() {
    if (!items[0]) return 0;
    const gap = 24; // matches CSS gap
    return items[0].getBoundingClientRect().width + gap;
  }

  // --- Move to index ---
  function goTo(idx) {
    const maxIdx    = Math.max(0, totalItems - visibleCount);
    currentIdx      = Math.max(0, Math.min(idx, maxIdx));
    const offset    = currentIdx * getItemWidth();
    track.style.transform = 'translateX(-' + offset + 'px)';
    updateDots();
     if (prevBtn) prevBtn.disabled = currentIdx === 0;
    if (nextBtn) nextBtn.disabled = currentIdx >= maxIdx;
  }

   if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIdx - visibleCount); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIdx + visibleCount); });

   function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 768)  return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function onResize() {
    visibleCount = getVisibleCount();
    buildDots();
    goTo(0); // reset to start on resize
  }

   let touchStartX = 0;
  let touchEndX   = 0;

  wrapper.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIdx + visibleCount); 
      else          goTo(currentIdx - visibleCount); 
    }
  }, { passive: true });

  // --- Mouse drag ---
  let isDragging  = false;
  let dragStartX  = 0;

  wrapper.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    wrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = '';
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goTo(currentIdx + visibleCount);
      else          goTo(currentIdx - visibleCount);
    }
  });

  // --- Init ---
  window.addEventListener('resize', onResize);
  onResize();
})();

  
  const carouselItems = document.querySelectorAll('.carousel-item');
  if (!carouselItems.length) return;

  const OFFSET_X = 24; 
  const OFFSET_Y = 24;

  carouselItems.forEach(function (item) {
    const preview = item.querySelector('.carousel-zoom-preview');
    if (!preview) return;
 
    item.addEventListener('mousemove', function (e) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pw = preview.offsetWidth  || 380;
      const ph = preview.offsetHeight || 280;

      let x = e.clientX + OFFSET_X;
      let y = e.clientY + OFFSET_Y;

    
      if (x + pw > vw - 16) x = e.clientX - pw - OFFSET_X;
      if (y + ph > vh - 16) y = e.clientY - ph - OFFSET_Y;

      preview.style.left = x + 'px';
      preview.style.top  = y + 'px';
    });

    // Reset position when leaving
    item.addEventListener('mouseleave', function () {
      preview.style.left = '-9999px';
      preview.style.top  = '-9999px';
    });
 
})();



(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('.input-error').forEach(function (el) { el.classList.remove('input-error'); });

    // Validate name
    const nameField = document.getElementById('contact-name');
    if (nameField && !nameField.value.trim()) {
      showError(nameField, 'Full name is required.');
      valid = false;
    }

    // Validate email
    const emailField = document.getElementById('contact-email');
    if (emailField) {
      const emailVal = emailField.value.trim();
      if (!emailVal) {
        showError(emailField, 'Email address is required.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showError(emailField, 'Please enter a valid email address.');
        valid = false;
      }
    }

    if (valid) {
      // Simulate successful submission
      const submitBtn = form.querySelector('#contact-submit');
      if (submitBtn) {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#16a34a';
        submitBtn.disabled = true;
        setTimeout(function () {
          form.reset();
          submitBtn.textContent = 'Request Custom Quote';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }
    }
  });

  function showError(input, message) {
    input.classList.add('input-error');
    const err = document.createElement('span');
    err.className   = 'field-error';
    err.textContent = message;
    err.style.cssText = 'color:#dc2626;font-size:12px;margin-top:4px;display:block;';
    input.parentNode.appendChild(err);
  }
})();


 
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a, .sticky-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          link.style.color = (href === '#' + entry.target.id) ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
})();
