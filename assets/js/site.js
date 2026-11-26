// Shikhar Goswami · Portfolio
// No dependencies. Everything here is progressive enhancement: the page is
// fully readable and usable with JavaScript turned off.

(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ── Theme toggle ─────────────────────────────────────────────────── */
  const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = () => root.getAttribute("data-theme") || (systemDark() ? "dark" : "light");

  $$("[data-theme-toggle]").forEach((btn) => {
    const label = () =>
      btn.setAttribute("aria-label", `Switch to ${currentTheme() === "dark" ? "light" : "dark"} mode`);
    label();
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  });

  /* ── Nav: hairline on scroll, mobile menu ─────────────────────────── */
  const nav = $("#gnav");
  const menuBtn = $(".gnav-menu");
  const links = $("#gnav-links");

  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  matchMedia("(min-width: 821px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* ── Nav: mark the section in view ────────────────────────────────── */
  const navLinks = $$('a[href^="#"]', links);
  const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(entry.target.id)?.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  });

  /* ── Scroll reveal with a gentle stagger per group ────────────────── */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    // Stagger siblings that share a parent so grids cascade in.
    const groups = new Map();
    reveals.forEach((el) => {
      const list = groups.get(el.parentElement) || [];
      list.push(el);
      groups.set(el.parentElement, list);
    });
    groups.forEach((list) => list.forEach((el, i) => el.style.setProperty("--d", `${Math.min(i, 5) * 80}ms`)));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => (el.closest(".hero") ? el.classList.add("is-in") : io.observe(el)));
  }

  /* ── Count-up stats (final value is already in the HTML) ──────────── */
  const counters = $$("[data-count]");
  if (!reduceMotion && counters.length) {
    const run = (el) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1400;
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          co.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ── Video facades: load YouTube only when asked ──────────────────── */
  $$(".video[data-yt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.yt;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = btn.getAttribute("aria-label").replace(/^Play: /, "");
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      const frame = document.createElement("div");
      frame.className = "video";
      frame.appendChild(iframe);
      btn.replaceWith(frame);
      iframe.focus();
    }, { once: true });
  });

  /* ── Copy email ───────────────────────────────────────────────────── */
  const toast = $(".toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2200);
  };
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast("Email copied");
      } catch (e) {
        location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });

  /* ── Résumé: fall back to a request if the PDF isn't published ────── */
  $$("[data-resume]").forEach((a) => {
    const fallback = () => {
      a.removeAttribute("download");
      a.href = "mailto:shikhargoswami2308@gmail.com?subject=R%C3%A9sum%C3%A9%20request";
      a.lastChild.textContent = " Request résumé";
    };
    if (location.protocol === "file:") return fallback();
    fetch(a.href, { method: "HEAD" })
      .then((r) => { if (!r.ok) fallback(); })
      .catch(fallback);
  });
})();
