import Swiper from 'swiper/bundle';

// Handle both a normal module load and a module loaded after DOM readiness.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage, { once: true });
} else {
  initPage();
}

function initPage() {
  initSwipers();
  initScrollSliders();
  initAccessibleNavigation();
  initFooter();
  if (document.body.dataset.page === 'super-market') initGroceryControls();
  if (document.body.classList.contains('product-page')) initProductPage();
}

function initProductPage() {
  const mainImage = document.querySelector('#product-main-image');
  document.querySelectorAll('.pd-thumb').forEach(thumb => thumb.addEventListener('click', () => {
    if (mainImage) mainImage.src = thumb.src;
    document.querySelectorAll('.pd-thumb').forEach(item => item.classList.toggle('active', item === thumb));
  }));
  const tabs = document.querySelectorAll('.pd-tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.pd-tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === tab.dataset.tab));
  }));
  const selectedColorName = document.querySelector('#selected-color-name');
  document.querySelectorAll('.pd-color-option').forEach(option => option.addEventListener('click', () => {
    document.querySelectorAll('.pd-color-option').forEach(item => {
      const active = item === option;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (selectedColorName) selectedColorName.textContent = option.dataset.color === 'gray' ? 'خاکستری' : 'آبی';
  }));
  document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', () => {
    button.textContent = 'به سبد خرید اضافه شد';
    button.classList.add('is-added');
  }));
}

function initSwipers() {
  const configurations = [
    ['.mySwiper', {
      slidesPerView: 1, spaceBetween: 10,
      breakpoints: { 240: { slidesPerView: 2 }, 390: { slidesPerView: 4 }, 768: { slidesPerView: 7 }, 1024: { slidesPerView: 12 } },
    }],
    ['.mySlider', {
      slidesPerView: 1.08, spaceBetween: 8, centeredSlides: true,
      breakpoints: { 640: { slidesPerView: 1, spaceBetween: 0 } },
      autoplay: { delay: 2500, disableOnInteraction: false },
    }],
    ['.myInc', {
      slidesPerView: 2.35, spaceBetween: 1,
      breakpoints: {
        280: { slidesPerView: 3.35 }, 320: { slidesPerView: 4.05 },
        480: { slidesPerView: 3.6 },
        640: { slidesPerView: 4.2 }, 768: { slidesPerView: 5.2 },
        1024: { slidesPerView: 6.2 }, 1280: { slidesPerView: 8.2 },
      },
    }],
    ['.myFavorites', {
      slidesPerView: 1, spaceBetween: 1,
      breakpoints: {
        640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      },
    }],
    ['.top-brands-slider', {
      slidesPerView: 1, spaceBetween: 0, centerInsufficientSlides: true,
      breakpoints: {
        320: { slidesPerView: 2 },
        640: { slidesPerView: 3 }, 768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 }, 1280: { slidesPerView: 6 },
      },
    }],
  ];
      for (const [selector, options] of configurations) {
    document.querySelectorAll(selector).forEach(container => {
      if (container.swiper) return;
      // Some source markup nests arrows inside the translated wrapper. Keep
      // controls outside that track so they remain stationary and clickable.
      container.querySelectorAll('.swiper-button-next, .swiper-button-prev, .top-brands-next, .top-brands-prev, .swiper-pagination').forEach(control => {
        if (control.closest('.swiper') === container && control.parentElement !== container) container.append(control);
      });
      const pagination = container.querySelector('.swiper-pagination');
      // Each repeated carousel gets its own buttons, not global selectors.
      new Swiper(container, {
        ...options,
        watchOverflow: true,
        threshold: 3,
        touchRatio: 1,
        simulateTouch: true,
        touchStartPreventDefault: false,
        passiveListeners: false,
        navigation: {
          nextEl: container.querySelector('.swiper-button-next, .top-brands-next'),
          prevEl: container.querySelector('.swiper-button-prev, .top-brands-prev'),
        },
        ...(pagination ? { pagination: { el: pagination, clickable: true } } : {}),
      });
    });
  }
}

function initScrollSliders() {
  document.querySelectorAll('.category-section .slider-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.slider-container');
    if (track) bindScrollSlider(wrapper, track, () => track.clientWidth * 3 / 7);
  });
  document.querySelectorAll('.product-slider-container').forEach(container => {
    const track = container.querySelector('.slider-track');
    if (track) bindScrollSlider(container, track, () => track.firstElementChild?.getBoundingClientRect().width || 190);
  });
}

function bindScrollSlider(container, track, distance) {
  const previous = container.querySelector('.prev-btn');
  const next = container.querySelector('.next-btn');
  const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
  const updateButtons = () => {
    const position = Math.abs(track.scrollLeft);
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    for (const [button, disabled] of [[previous, position <= 1], [next, position >= maximum - 1]]) {
      if (!button) continue;
      button.disabled = disabled;
      button.setAttribute('aria-disabled', String(disabled));
      button.classList.toggle('is-hidden', disabled);
    }
  };
  previous?.addEventListener('click', () => track.scrollBy({ left: -direction * distance(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: direction * distance(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateButtons, { passive: true });
  new ResizeObserver(updateButtons).observe(track);
  track.querySelectorAll('img').forEach(image => image.addEventListener('load', updateButtons, { once: true }));
  updateButtons();

  // Touch and trackpad scrolling stay native. Mouse dragging suppresses link
  // activation only after an actual drag, and prevents native image dragging.
  let drag = null;
  let suppressClick = false;
  track.classList.add('cursor-grab');
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button,input')) return;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, scroll: track.scrollLeft };
  });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const delta = event.clientX - drag.x;
    if (!suppressClick && Math.abs(delta) <= 5) return;
    suppressClick = true;
    track.setPointerCapture(event.pointerId);
    track.style.scrollBehavior = 'auto';
    track.style.cursor = 'grabbing';
    event.preventDefault();
    track.scrollLeft = drag.scroll - delta * 1.5;
  });
  const finishDrag = event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    drag = null;
    track.style.cursor = '';
    track.style.scrollBehavior = '';
  };
  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('lostpointercapture', finishDrag);
  track.addEventListener('pointerleave', event => {
    if (drag && !track.hasPointerCapture(event.pointerId)) finishDrag(event);
  });
  track.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
}

function initGroceryControls() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  categoryTabs.forEach(tab => tab.addEventListener('click', () => {
    categoryTabs.forEach(item => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.category-content').forEach(content => {
      content.classList.toggle('active', content.id === tab.dataset.category);
    });
  }));
  const navbar = document.querySelector('.navbar');
  const header = document.querySelector('.header');
  const story = document.querySelector('.story');
  if (navbar && header && story) window.addEventListener('scroll', () => {
    navbar.style.transform = `translateY(-${Math.max(0, Math.min(window.scrollY - story.offsetTop, 60))}px)`;
  }, { passive: true });
}

function initFooter() {
  const text = document.getElementById('myText');
  const button = document.getElementById('myBtn');
  if (text && button) button.addEventListener('click', () => {
    button.textContent = text.classList.toggle('expanded') ? 'بستن <' : 'مشاهده بیشتر >';
  });
}

function initAccessibleNavigation() {
  document.querySelectorAll('.has-mega-menu').forEach((menu, index) => {
    const trigger = menu.querySelector(':scope > a');
    const panel = menu.querySelector(':scope > .mega-menu');
    if (!trigger || !panel) return;
    panel.id ||= `category-menu-${index}`;
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', 'false');
    let openedByHover = false;
    const positionPanel = () => {
      // Fixed positioning escapes the compact navigation's scroll clipping.
      const top = Math.max(0, trigger.getBoundingClientRect().bottom);
      // Keep native vertical touch scrolling available on compact menus.
      panel.style.touchAction = 'pan-y';
      panel.querySelector('.mega-sidebar')?.style.setProperty('touch-action', 'pan-y');
      panel.style.setProperty('--menu-top', `${top}px`);
      if (window.innerWidth <= 1280) {
        // Inline geometry wins over the desktop/static utility rules and keeps
        // the panel inside the viewport on watch-sized screens.
        panel.style.setProperty('left', '8px', 'important');
        panel.style.setProperty('right', 'auto', 'important');
        panel.style.setProperty('width', 'calc(100vw - 16px)', 'important');
        panel.style.setProperty('max-height', `calc(100dvh - ${top}px - 8px)`, 'important');
      } else {
        panel.style.removeProperty('left');
        panel.style.removeProperty('right');
        panel.style.removeProperty('width');
        panel.style.removeProperty('max-height');
      }
    };
    const setOpen = open => {
      if (open) positionPanel();
      menu.classList.toggle('menu-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      if (!open) openedByHover = false;
    };
    trigger.addEventListener('click', event => {
      event.preventDefault();
      setOpen(openedByHover || !menu.classList.contains('menu-open'));
      openedByHover = false;
    });
    menu.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && !menu.classList.contains('menu-open')) {
        setOpen(true);
        openedByHover = true;
      }
    });
    menu.addEventListener('pointerleave', event => {
      // At compact widths the panel is fixed outside the scrolling nav. Keep
      // it open while the pointer travels into the panel and let outside-click
      // or Escape close it.
      if (event.pointerType === 'mouse' && openedByHover && window.innerWidth > 1280) setOpen(false);
    });
    document.addEventListener('pointerdown', event => {
      if (!menu.contains(event.target)) setOpen(false);
    });
    menu.addEventListener('focusout', event => {
      if (!menu.contains(event.relatedTarget)) setOpen(false);
    });
    window.addEventListener('resize', positionPanel);
    document.addEventListener('scroll', event => {
      if (!panel.contains(event.target) && menu.classList.contains('menu-open')) positionPanel();
    }, { capture: true, passive: true });
    trigger.addEventListener('focus', () => {
      if (menu.classList.contains('menu-open')) positionPanel();
    });
    trigger.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); trigger.click(); }
    });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.focus();
      }
    });
    menu.querySelectorAll('.mega-sidebar li').forEach(item => {
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      const activate = () => {
        menu.querySelectorAll('.mega-sidebar li').forEach(other => other.classList.toggle('active', other === item));
        menu.querySelectorAll('.content-pane').forEach(pane => pane.classList.toggle('active', pane.id === item.dataset.target));
      };
      item.addEventListener('click', activate);
      item.addEventListener('mouseenter', activate);
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
      });
    });
  });
}
