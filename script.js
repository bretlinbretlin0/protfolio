/**
 * Personal Portfolio — Main JavaScript
 * Handles theme toggle, navigation, scroll animations, and mobile menu.
 */

(function () {
  'use strict';

  /* ----- DOM References ----- */
  const html = document.documentElement;
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const revealElements = document.querySelectorAll('.reveal');
  const yearEl = document.getElementById('year');

  const THEME_KEY = 'portfolio-theme';
  const NAV_OFFSET = 72; /* matches --nav-height in CSS */

  /* ============================================
     Theme Toggle (Dark / Light Mode)
     ============================================ */

  /**
   * Apply theme to document and persist to localStorage.
   * @param {string} theme - 'light' or 'dark'
   */
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Initialize theme from saved preference or system setting.
   */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);

    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  /**
   * Toggle between light and dark themes.
   */
  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ============================================
     Smooth Scrolling (with navbar offset)
     ============================================ */

  /**
   * Scroll to a section accounting for fixed navbar height.
   * @param {string} targetId - Section id including '#'
   */
  function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /**
   * Attach smooth scroll behavior to all in-page anchor links.
   */
  function initSmoothScroll() {
    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        scrollToSection(href);
        closeMobileMenu();
      });
    });
  }

  /* ============================================
     Active Navigation Link Highlight
     ============================================ */

  /**
   * Update which nav link is marked active based on scroll position.
   */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentId = 'home';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - NAV_OFFSET - 80;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     Mobile Navigation Menu
     ============================================ */

  /**
   * Open or close the mobile navigation drawer.
   */
  function toggleMobileMenu() {
    const isOpen = navbar.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  /**
   * Close mobile menu (used after link click).
   */
  function closeMobileMenu() {
    navbar.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  /**
   * Initialize hamburger toggle and close on outside click.
   */
  function initMobileNav() {
    navToggle.addEventListener('click', toggleMobileMenu);

    document.addEventListener('click', function (e) {
      if (
        navbar.classList.contains('nav-open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  /* ============================================
     Scroll Reveal Animations
     ============================================ */

  /**
   * Observe elements with .reveal class and add .revealed when in viewport.
   */
  function initScrollReveal() {
    if (!revealElements.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     Footer Year
     ============================================ */

  /**
   * Set current year in footer copyright.
   */
  function initFooterYear() {
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     Initialize on DOM Ready
     ============================================ */

  function init() {
    initTheme();
    initSmoothScroll();
    initMobileNav();
    initScrollReveal();
    initFooterYear();

    themeToggle.addEventListener('click', toggleTheme);

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
