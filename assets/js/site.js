document.documentElement.classList.add("js");

const siteHeader = document.querySelector("[data-site-header]");
const menuButton = document.querySelector("[data-menu-button]");
const siteNavigation = document.querySelector("[data-site-navigation]");
const menuCloseTargets = siteNavigation?.querySelectorAll("a");
let lastMenuFocus = null;
let menuScrollY = 0;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

function setMenu(open) {
  if (!menuButton || !siteNavigation) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  // Lock the page by making the body fixed at the current scroll offset.
  // This keeps the viewport exactly where the user is (mobile browsers
  // otherwise reset the scroll position when body overflow is hidden).
  if (open) {
    menuScrollY = window.scrollY;
    document.body.style.top = `-${menuScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
  } else {
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    window.scrollTo(0, menuScrollY);
  }
  document.body.classList.toggle("menu-open", open);
  siteNavigation.toggleAttribute("data-open", open);

  if (open) {
    lastMenuFocus = document.activeElement;
    // Deliberately do not move focus into the menu here. Focusing the first
    // link makes mobile browsers scroll it into view, which jumps the page
    // back to the top. The Tab trap below keeps keyboard users inside the
    // menu, and focus returns to the trigger when it closes.
  } else if (lastMenuFocus instanceof HTMLElement) {
    lastMenuFocus.focus({ preventScroll: true });
  }
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

menuCloseTargets?.forEach((link) => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
    setMenu(false);
  }

  if (event.key === "Tab" && document.body.classList.contains("menu-open") && siteNavigation) {
    const focusable = [...siteNavigation.querySelectorAll(focusableSelector), menuButton].filter(Boolean);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 960 && document.body.classList.contains("menu-open")) setMenu(false);
});

function updateHeader() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 16);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const autoRevealSelector = [
  ".split-copy > *",
  ".contact-panel > *",
  ".form-grid > .field",
  ".form-grid > .consent",
  ".form-grid > .field-full:last-child",
  ".map-card > *",
  ".social-actions > *",
  ".cta-inner > *",
  ".footer-grid > *",
  ".footer-bottom > *",
  ".prose > h2",
  ".prose > h3",
  ".prose > p",
  ".prose > ul"
].join(",");

document.querySelectorAll(autoRevealSelector).forEach((item) => {
  if (!item.hasAttribute("data-reveal")) item.setAttribute("data-reveal", "");
});

document.querySelectorAll(".split-media[data-reveal], .contact-panel[data-reveal], .map-card > iframe[data-reveal], .social-copy[data-reveal]").forEach((item) => {
  item.setAttribute("data-reveal-origin", "left");
});

document.querySelectorAll(".split-copy[data-reveal], .contact-grid > [data-reveal]:last-child, .map-card > .map-content[data-reveal], .facebook-feed-shell[data-reveal]").forEach((item) => {
  item.setAttribute("data-reveal-origin", "right");
});

const revealItems = document.querySelectorAll("[data-reveal]");

document.querySelectorAll(".card-grid, .feature-grid, .horse-grid, .rate-grid, .gallery-grid, .split-copy, .contact-panel, .form-grid, .map-card, .social-actions, .cta-inner, .footer-grid, .footer-bottom, .prose").forEach((group) => {
  [...group.children].filter((item) => item.hasAttribute("data-reveal")).forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 70}ms`);
  });
});

const facebookFeed = document.querySelector(".facebook-feed");
let facebookResizeTimer = 0;

function syncFacebookFeedWidth() {
  if (!facebookFeed) return;
  const feedWidth = Math.max(180, Math.min(500, Math.floor(facebookFeed.getBoundingClientRect().width)));
  const feedUrl = new URL(facebookFeed.src, window.location.href);
  if (feedUrl.searchParams.get("width") === String(feedWidth)) return;
  feedUrl.searchParams.set("width", String(feedWidth));
  facebookFeed.src = feedUrl.toString();
}

if (facebookFeed) {
  requestAnimationFrame(syncFacebookFeedWidth);
  window.addEventListener("resize", () => {
    window.clearTimeout(facebookResizeTimer);
    facebookResizeTimer = window.setTimeout(syncFacebookFeedWidth, 180);
  }, { passive: true });
}

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
document.body.append(scrollProgress);

let progressFrame = 0;
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
  progressFrame = 0;
}

function requestProgressUpdate() {
  if (progressFrame) return;
  progressFrame = window.requestAnimationFrame(updateScrollProgress);
}

updateScrollProgress();
window.addEventListener("scroll", requestProgressUpdate, { passive: true });
window.addEventListener("resize", requestProgressUpdate);

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.setAttribute("data-visible", ""));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-visible", "");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const filterButtons = document.querySelectorAll("[data-horse-filter]");
const horseCards = document.querySelectorAll("[data-horse-status]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.horseFilter;
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    horseCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.horseStatus !== filter;
    });
    const emptyState = document.querySelector("[data-horse-empty]");
    if (emptyState) emptyState.hidden = [...horseCards].some((card) => !card.hidden);
  });
});

const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
const lightboxTriggers = [...document.querySelectorAll("[data-lightbox-src]")];
let currentLightboxIndex = 0;
let lightboxReturnFocus = null;

function showLightbox(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxTriggers.length) return;
  currentLightboxIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
  const trigger = lightboxTriggers[currentLightboxIndex];
  lightboxImage.src = trigger.dataset.lightboxSrc;
  lightboxImage.alt = trigger.dataset.lightboxAlt || "";
  lightboxCaption.textContent = trigger.dataset.lightboxCaption || trigger.dataset.lightboxAlt || "";
  if (!lightbox.open) {
    lightboxReturnFocus = trigger;
    lightbox.showModal();
  }
}

lightboxTriggers.forEach((trigger, index) => trigger.addEventListener("click", () => showLightbox(index)));
lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => lightbox.close());
lightbox?.querySelector("[data-lightbox-previous]")?.addEventListener("click", () => showLightbox(currentLightboxIndex - 1));
lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => showLightbox(currentLightboxIndex + 1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showLightbox(currentLightboxIndex - 1);
  if (event.key === "ArrowRight") showLightbox(currentLightboxIndex + 1);
});
lightbox?.addEventListener("close", () => {
  if (lightboxImage) lightboxImage.removeAttribute("src");
  lightboxReturnFocus?.focus();
});

// Contact form submission is handled by assets/js/contact-form.js, which
// intercepts the submit event in the capture phase.
