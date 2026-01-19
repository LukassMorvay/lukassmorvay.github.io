/* =========================================
   Lukáš Morvay — Personal Website (Interactions)
   File: script.js
   ========================================= */

(function () {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Theme (dark/light) ----------
  const themeToggle = $("#themeToggle");
  const root = document.documentElement;

  function getSystemPref() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {
      // ignore
    }

    // Update toggle icon to reflect current theme
    const icon = themeToggle?.querySelector(".btn__icon");
    if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (_) {
      saved = null;
    }

    const theme = saved || getSystemPref();
    setTheme(theme);

    // If user hasn’t explicitly chosen a theme, follow system changes live
    if (!saved && window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: light)");
      mq.addEventListener?.("change", () => setTheme(getSystemPref()));
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      setTheme(next);
    });
  }

  // ---------- Mobile menu ----------
  const burger = $("#burger");
  const mobile = $("#mobileMenu");

  function openMenu() {
    if (!burger || !mobile) return;
    burger.setAttribute("aria-expanded", "true");
    mobile.hidden = false;
    mobile.dataset.open = "true";

    // Subtle entrance
    mobile.animate(
      [
        { opacity: 0, transform: "translateY(-6px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );
  }

  function closeMenu() {
    if (!burger || !mobile) return;
    burger.setAttribute("aria-expanded", "false");

    // Animate out then hide
    const anim = mobile.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-6px)" },
      ],
      { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );
    anim.onfinish = () => {
      mobile.hidden = true;
      mobile.dataset.open = "false";
    };
  }

  function toggleMenu() {
    if (!mobile) return;
    const isOpen = mobile.dataset.open === "true" && !mobile.hidden;
    isOpen ? closeMenu() : openMenu();
  }

  if (burger && mobile) {
    burger.addEventListener("click", toggleMenu);

    // Close when clicking a menu link
    $$(".mobile__link", mobile).forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // Close on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close menu if resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  // ---------- Reveal on scroll (IntersectionObserver) ----------
  const revealEls = $$(".reveal");

  function makeVisible(el) {
    el.classList.add("is-visible");
  }

  function initReveal() {
    // If reduced motion, show everything immediately
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      revealEls.forEach(makeVisible);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      // Fallback: show all
      revealEls.forEach(makeVisible);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            makeVisible(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- Smooth scroll offset fix for sticky header ----------
  // (Helps ensure anchors don't end up hidden behind header.)
  function initAnchorOffset() {
    const header = $(".header");
    if (!header) return;

    const headerHeight = () => header.getBoundingClientRect().height + 14;

    $$('.nav__link, .mobile__link, a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - headerHeight();
        window.scrollTo({ top: y, behavior: "smooth" });

        // Update URL without jumping
        history.pushState(null, "", href);
      });
    });
  }

  // ---------- Footer year ----------
  function initYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------- Tiny UX polish: active section highlight ----------
  // (Highlights nav link for current section on desktop)
  function initActiveNav() {
    const navLinks = $$(".nav__link");
    if (!navLinks.length || !("IntersectionObserver" in window)) return;

    const sections = navLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const map = new Map();
    navLinks.forEach((a) => map.set(a.getAttribute("href"), a));

    const io = new IntersectionObserver(
      (entries) => {
        // find the most prominent visible section
        const visible = entries.filter((x) => x.isIntersecting);
        if (!visible.length) return;

        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = "#" + visible[0].target.id;

        navLinks.forEach((a) => a.classList.remove("is-active"));
        const active = map.get(id);
        if (active) active.classList.add("is-active");
      },
      { threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((s) => io.observe(s));
  }

  // Add styling for .is-active without touching CSS file too much:
  // We'll inject a tiny style tag (keeps it self-contained).
  function injectActiveNavStyle() {
    const style = document.createElement("style");
    style.textContent = `
      .nav__link.is-active {
        background: var(--surface-2);
        color: var(--text);
        border: 1px solid var(--stroke);
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- Init ----------
  initTheme();
  initReveal();
  initAnchorOffset();
  initYear();
  injectActiveNavStyle();
  initActiveNav();
})();
