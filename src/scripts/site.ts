import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initSite() {
  gsap.registerPlugin(ScrollTrigger);

  const controller = new AbortController();
  const { signal } = controller;
  const header = document.querySelector<HTMLElement>('[data-header]');
  const menu = document.querySelector<HTMLDialogElement>('#site-menu');
  const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const mobileContact = document.querySelector<HTMLElement>('[data-mobile-contact]');
  const hero = document.querySelector<HTMLElement>('#top');
  const visit = document.querySelector<HTMLElement>('#visit');
  const motion = gsap.matchMedia();
  let lenis: Lenis | undefined;
  let lastFocus: HTMLElement | null = null;
  let animationFrame = 0;
  let resizeObserver: ResizeObserver | undefined;
  let disposed = false;
  let menuAnimation: gsap.core.Timeline | undefined;
  let closingMenu: Promise<void> | undefined;
  let resolveMenuClose: (() => void) | undefined;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuItems = menu ? Array.from(menu.querySelectorAll<HTMLElement>('.menu-dialog > .eyebrow, nav li, .menu-instagram')) : [];
  const closeLines = closeButton ? Array.from(closeButton.querySelectorAll('span')) : [];

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true, signal });

  // Native <dialog> supplies focus containment, Escape, and an inert background.
  const restoreMenu = () => {
    menuAnimation?.kill();
    menuAnimation = undefined;
    if (menu) {
      gsap.set([menu, ...menuItems, ...closeLines], { clearProps: 'transform,opacity' });
      menu.style.removeProperty('--menu-backdrop-opacity');
    }
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'メニューを開く');
    const label = menuButton?.querySelector('small');
    if (label) label.textContent = 'MENU';
    document.body.classList.remove('menu-is-open');
    lenis?.start();
    lastFocus?.focus({ preventScroll: true });
    lastFocus = null;
    const resolve = resolveMenuClose;
    resolveMenuClose = undefined;
    closingMenu = undefined;
    resolve?.();
  };
  const closeMenu = (): Promise<void> => {
    if (closingMenu) return closingMenu;
    if (!menu?.open) return Promise.resolve();
    closingMenu = new Promise<void>((resolve) => { resolveMenuClose = resolve; });
    menuAnimation?.kill();
    if (reducedMotion.matches) {
      menu.close();
    } else {
      menuAnimation = gsap.timeline({ onComplete: () => menu.close() });
      menuAnimation.to(menuItems, { x: 12, opacity: 0, duration: 0.14, stagger: { each: 0.02, from: 'end' }, ease: 'power1.in' }, 0);
      menuAnimation.to(closeLines[0], { y: -4, rotation: 0, duration: 0.24 }, 0);
      menuAnimation.to(closeLines[1], { y: 4, rotation: 0, duration: 0.24 }, 0);
      menuAnimation.to(menu, { xPercent: 100, duration: 0.32, ease: 'power2.in' }, 0.1);
      menuAnimation.to(menu, { '--menu-backdrop-opacity': 0, duration: 0.28 }, 0.14);
    }
    return closingMenu;
  };
  menuButton?.addEventListener('click', () => {
    if (!menu) return;
    if (menu.open) { void closeMenu(); return; }
    menuAnimation?.kill();
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton;
    menu.showModal();
    menu.scrollTop = 0;
    document.body.classList.add('menu-is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'メニューを閉じる');
    const label = menuButton.querySelector('small');
    if (label) label.textContent = 'CLOSE';
    lenis?.stop();
    closeButton?.focus();
    if (reducedMotion.matches) {
      gsap.set(menu, { xPercent: 0, '--menu-backdrop-opacity': 1 });
      gsap.set(closeLines[0], { y: 0, rotation: 45 });
      gsap.set(closeLines[1], { y: 0, rotation: -45 });
      return;
    }
    menuAnimation = gsap.timeline();
    menuAnimation.fromTo(menu, { xPercent: 100, '--menu-backdrop-opacity': 0 }, { xPercent: 0, '--menu-backdrop-opacity': 1, duration: 0.48, ease: 'power3.out' }, 0);
    menuAnimation.fromTo(menuItems, { x: 22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.32, stagger: 0.045, ease: 'power2.out' }, 0.15);
    menuAnimation.fromTo(closeLines[0], { y: -4, rotation: 0 }, { y: 0, rotation: 45, duration: 0.32 }, 0.1);
    menuAnimation.fromTo(closeLines[1], { y: 4, rotation: 0 }, { y: 0, rotation: -45, duration: 0.32 }, 0.1);
  }, { signal });
  closeButton?.addEventListener('click', () => { void closeMenu(); }, { signal });
  menu?.addEventListener('close', restoreMenu, { signal });
  menu?.addEventListener('cancel', (event) => { event.preventDefault(); void closeMenu(); }, { signal });
  menu?.addEventListener('click', (event: MouseEvent) => {
    if (event.target !== menu) return;
    const bounds = menu.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) void closeMenu();
  }, { signal });
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) menuAnimation?.progress(1);
  }, { signal });

  // The mobile action is useful while reading, and yields to the actual contact.
  let heroVisible = true;
  let visitVisible = false;
  const syncContact = () => mobileContact?.classList.toggle('is-hidden', heroVisible || visitVisible);
  const heroObserver = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncContact(); }, { threshold: 0.16 });
  const visitObserver = new IntersectionObserver(([entry]) => { visitVisible = entry.isIntersecting; syncContact(); }, { threshold: 0 });
  if (hero) heroObserver.observe(hero);
  if (visit) visitObserver.observe(visit);
  syncContact();

  motion.add({ desktop: '(min-width: 1100px) and (pointer: fine)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
    const conditions = context.conditions as { desktop: boolean; reduce: boolean };
    if (!conditions.desktop || conditions.reduce) return;
    const scroller = new Lenis({ duration: 0.85, smoothWheel: true, syncTouch: false, autoRaf: false });
    lenis = scroller;
    scroller.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => scroller.raf(time * 1000);
    gsap.ticker.add(tick);
    if (menu?.open) scroller.stop();
    return () => {
      gsap.ticker.remove(tick);
      scroller.destroy();
      if (lenis === scroller) lenis = undefined;
    };
  });

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
    intro.from('[data-hero-line]', { y: 24, opacity: 0, duration: 0.75, stagger: 0.13, clearProps: 'transform,opacity' });
    intro.fromTo('[data-hero-plane]', { x: -30, y: 20, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.8, clearProps: 'opacity' }, 0.25);
    // A short flight settles within five seconds; nothing floats indefinitely.
    intro.to('[data-hero-plane]', { x: 7, y: -9, duration: 1.4, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 1.05);

    const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    const pending = new Set(reveals);
    const timelines = new Set<gsap.core.Tween>();
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        revealObserver.unobserve(element);
        pending.delete(element);
        const tween = gsap.fromTo(element, { y: 23, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform,opacity', onComplete: () => timelines.delete(tween) });
        timelines.add(tween);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });

    // Only arm elements after the observer is ready; base HTML stays visible.
    for (const element of reveals) {
      if (element.getBoundingClientRect().top > window.innerHeight) gsap.set(element, { opacity: 0 });
      revealObserver.observe(element);
    }
    return () => {
      intro.kill();
      revealObserver.disconnect();
      timelines.forEach(tween => tween.kill());
      gsap.set(reveals, { clearProps: 'transform,opacity' });
      pending.clear();
    };
  });

  motion.add('(min-width: 1100px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLElement>('.doodle-star, .about__loop').forEach((element, index) => {
      gsap.fromTo(element, { y: 10 }, { y: -14, rotation: index % 2 ? 5 : -5, ease: 'none', scrollTrigger: { trigger: element.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
  });

  document.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    const hash = link?.getAttribute('href');
    if (!hash || hash === '#' || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    if (menu?.open) {
      // Anchor navigation moves focus to its destination, rather than the opener.
      lastFocus = null;
      await closeMenu();
      if (disposed) return;
    }
    const finish = () => {
      history.replaceState(null, '', hash);
      const existingTabIndex = target.getAttribute('tabindex');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (existingTabIndex === null) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true, signal });
    };
    if (lenis) lenis.scrollTo(target, { offset: -105, onComplete: finish });
    else {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - (window.innerWidth < 768 ? 95 : 120));
      window.scrollTo({ top, behavior: reduce ? 'instant' : 'smooth' });
      finish();
    }
  }, { signal });

  const refreshPositions = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
  };
  window.addEventListener('load', refreshPositions, { once: true, signal });
  document.fonts?.ready.then(() => { if (!disposed) refreshPositions(); });
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(refreshPositions);
    const main = document.querySelector('main');
    if (main) resizeObserver.observe(main);
  }

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    menuAnimation?.kill();
    if (menu?.open) menu.close();
    lastFocus = null;
    restoreMenu();
    cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();
    heroObserver.disconnect();
    visitObserver.disconnect();
    motion.revert();
    document.body.classList.remove('menu-is-open');
  };
  document.addEventListener('astro:before-swap', dispose, { once: true, signal });
  if (import.meta.hot) import.meta.hot.dispose(dispose);
}
