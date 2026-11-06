const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const navigationLinks = navigation ? [...navigation.querySelectorAll('a[href^="#"]')] : [];

function setMenuOpen(isOpen) {
    if (!header || !menuToggle) return;

    header.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

if (header && menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!header.contains(event.target)) setMenuOpen(false);
    });

    window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
        if (event.matches) setMenuOpen(false);
    });
}

if ("IntersectionObserver" in window && navigationLinks.length) {
    const sections = navigationLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter((section) => section);

    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const activeId = visibleSections[0]?.target.id;

        navigationLinks.forEach((link) => {
            if (link.hash === `#${activeId}`) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }, {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach((section) => sectionObserver.observe(section));
}

const skillCards = document.querySelectorAll(".skill-card");
const supportsCursorGlow = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsCursorGlow && !prefersReducedMotion) {
    skillCards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        const glow = {
            x: bounds.width / 2,
            y: bounds.height / 2,
            targetX: bounds.width / 2,
            targetY: bounds.height / 2,
            opacity: 0,
            targetOpacity: 0,
            frame: 0,
        };

        const animateGlow = () => {
            glow.x += (glow.targetX - glow.x) * 0.2;
            glow.y += (glow.targetY - glow.y) * 0.2;
            glow.opacity += (glow.targetOpacity - glow.opacity) * 0.2;

            if (Math.abs(glow.targetX - glow.x) < 0.1) glow.x = glow.targetX;
            if (Math.abs(glow.targetY - glow.y) < 0.1) glow.y = glow.targetY;
            if (Math.abs(glow.targetOpacity - glow.opacity) < 0.01) glow.opacity = glow.targetOpacity;

            card.style.setProperty("--glow-x", `${glow.x}px`);
            card.style.setProperty("--glow-y", `${glow.y}px`);
            card.style.setProperty("--glow-opacity", glow.opacity.toFixed(2));

            if (glow.x !== glow.targetX || glow.y !== glow.targetY || glow.opacity !== glow.targetOpacity) {
                glow.frame = requestAnimationFrame(animateGlow);
            } else {
                glow.frame = 0;
            }
        };

        const requestGlowFrame = () => {
            if (!glow.frame) glow.frame = requestAnimationFrame(animateGlow);
        };

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            glow.targetX = event.clientX - rect.left;
            glow.targetY = event.clientY - rect.top;
            glow.targetOpacity = 1;
            requestGlowFrame();
        });

        card.addEventListener("pointerleave", () => {
            glow.targetOpacity = 0;
            requestGlowFrame();
        });
    });
}
