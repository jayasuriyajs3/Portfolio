const menuToggleButton = document.getElementById("menu-toggle");
const primaryNav = document.getElementById("primary-nav");
const navLinks = document.querySelectorAll(".nav a");
const revealElements = document.querySelectorAll(".reveal");
const yearNode = document.getElementById("year");
const scrollProgressNode = document.getElementById("scroll-progress");
const sections = document.querySelectorAll("main section[id]");
const tiltCards = document.querySelectorAll(".tilt-card");

if (menuToggleButton && primaryNav) {
  menuToggleButton.addEventListener("click", () => {
    const isExpanded = menuToggleButton.getAttribute("aria-expanded") === "true";
    menuToggleButton.setAttribute("aria-expanded", String(!isExpanded));
    primaryNav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (primaryNav?.classList.contains("open") && menuToggleButton) {
      primaryNav.classList.remove("open");
      menuToggleButton.setAttribute("aria-expanded", "false");
    }
  });
});

const updateScrollProgress = () => {
  if (!scrollProgressNode) {
    return;
  }

  const scrollTop = window.scrollY || window.pageYOffset;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
  scrollProgressNode.style.width = `${progress}%`;
};

const updateActiveNav = () => {
  let activeSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionBottom = sectionTop + section.offsetHeight;
    const currentScroll = window.scrollY;

    if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
      activeSectionId = section.getAttribute("id") || "";
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const matches = href === `#${activeSectionId}`;
    link.classList.toggle("active", matches);
  });
};

const handleScroll = () => {
  updateScrollProgress();
  updateActiveNav();
};

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", handleScroll);
handleScroll();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = (0.5 - (y / rect.height)) * 7;
    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
  });
});

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
