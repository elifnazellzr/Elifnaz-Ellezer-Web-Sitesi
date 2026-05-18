/* SCROLL REVEAL */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
  },
);

revealElements.forEach((el) => observer.observe(el));

/* ACTIVE NAVBAR - SCROLL SPY */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 160) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (current && link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

/* HAMBURGER MENU */

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileNav.classList.remove("open");
    });
  });
}

/* THEME TOGGLE */

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Apply saved theme on load
let savedTheme = localStorage.getItem("theme");

if (!savedTheme) {
  savedTheme = "dark";
  localStorage.setItem("theme", "dark");
}

if (savedTheme === "light") {
  html.setAttribute("data-theme", "light");
} else {
  html.removeAttribute("data-theme");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = html.getAttribute("data-theme") === "light";
    if (isLight) {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

/* CONTACT FORM — Formspree AJAX */

const contactForm = document.getElementById("contact-form");
const submitBtn   = document.getElementById("submit-btn");
const formStatus  = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Gönderiliyor…";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        formStatus.textContent = "✓ Mesajın iletildi, en kısa sürede dönüş yapacağım.";
        formStatus.classList.add("form-status--ok");
        contactForm.reset();
      } else {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.message || "Bilinmeyen hata");
      }
    } catch (err) {
      formStatus.textContent = "✗ Gönderilemedi: " + err.message;
      formStatus.classList.add("form-status--err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Gönder";
    }
  });
}
