const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Mobile menu
const navLinks = $("#navLinks"), menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// Hero bubbles
const bubbles = $(".bubbles");
for (let i = 0; i < 14; i++) {
  const b = document.createElement("i"), s = 10 + Math.random() * 40;
  b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;` +
    `animation-duration:${8 + Math.random() * 10}s;animation-delay:${-Math.random() * 12}s`;
  bubbles.appendChild(b);
}

// Scroll reveal + counters
const countUp = el => {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n;
    if (n === target) clearInterval(t);
  }, 25);
};
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    observer.unobserve(e.target);
  });
}, { threshold: 0.2 });
$$(".reveal").forEach(el => observer.observe(el));

// Product info popup
const modal = $("#modal"), mInfo = $("#modalInfo"), mImg = $("#modalImg");
let lastBtn;
$$(".view").forEach(btn => btn.addEventListener("click", () => {
  const card = btn.closest(".product-card"), img = card.querySelector("img");
  mImg.src = img.src; mImg.alt = img.alt;
  mInfo.innerHTML = card.querySelector(".detail").innerHTML;
  mInfo.querySelector("h3").id = "modalTitle";
  lastBtn = btn;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $("#modalClose").focus();
}));
// Clicking the can image or the product name also opens the popup
$$(".product-card").forEach(card => {
  const btn = card.querySelector(".view");
  card.querySelectorAll(".glow, :scope > h3").forEach(el => el.addEventListener("click", () => btn.click()));
});
const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastBtn) lastBtn.focus();
};
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
mInfo.addEventListener("click", e => { if (e.target.closest("a")) closeModal(); });

// Navbar shrink + back-to-top
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $("#nav").classList.toggle("scrolled", y > 40);
  $("#toTop").classList.toggle("show", y > 600);
}, { passive: true });

// Separate pages: show one view at a time (Home, About, Products, Food, Contact)
const views = [...$$("[data-view]")];
const links = [...$$("#navLinks a")];
const showView = () => {
  const wanted = location.hash.slice(1);
  const name = views.some(v => v.dataset.view === wanted) ? wanted
    : (views.find(v => v.id === wanted) || {}).dataset?.view || "home";
  views.forEach(v => v.classList.toggle("view-off", v.dataset.view !== name));
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + name));
  window.scrollTo({ top: 0, behavior: "instant" });
};
window.addEventListener("hashchange", showView);
showView();
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Contact topics + search
const topicsView = $("#topicsView"), contactForm = $("#contactForm");
$$(".topic-list button").forEach(b => b.addEventListener("click", () => {
  $("#formTopic").textContent = b.dataset.topic;
  topicsView.hidden = true;
  contactForm.hidden = false;
  $("#formMsg").textContent = "";
  $("#name").focus();
}));
$("#backBtn").addEventListener("click", () => { contactForm.hidden = true; topicsView.hidden = false; });
$("#topicSearch").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  let shown = 0;
  $$(".topic-list li").forEach(li => {
    const ok = li.textContent.toLowerCase().includes(q);
    li.hidden = !ok;
    if (ok) shown++;
  });
  $("#noTopic").hidden = shown > 0;
  if (!contactForm.hidden) { contactForm.hidden = true; topicsView.hidden = false; }
});

// Contact form validation
const form = $("#contactForm"), msg = $("#formMsg");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const text = form.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !text) {
    msg.textContent = "Please fill in all fields with a valid email.";
    msg.className = "form-msg err";
    return;
  }
  msg.textContent = "Thanks, " + name + "! Your message about \"" + $("#formTopic").textContent + "\" was sent (demo).";
  msg.className = "form-msg ok";
  form.reset();
});

// Footer year
$("#year").textContent = new Date().getFullYear();
