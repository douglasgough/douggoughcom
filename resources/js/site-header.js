(() => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const rawPath = window.location.pathname;
  const trimmedPath = rawPath.replace(/\/+$/, "");
  const isHome = trimmedPath === "" || trimmedPath === "/";
  const currentPath = isHome ? "/" : trimmedPath;
  const contactHref = isHome ? "#contact" : "/#contact";
  const isContactPage = currentPath === "/contact";

  const navItems = [
    { label: "Home", href: "/", match: "/" },
    { label: "Solutions", href: "/solutions", match: "/solutions" },
    { label: "How I Work", href: "/how-i-work", match: "/how-i-work" },
    { label: "About", href: "/about", match: "/about" },
    { label: "Contact", href: "/contact", match: "/contact" },
  ];

  const navLinks = navItems
    .map((item) => {
      const isActive = item.match && currentPath === item.match;
      const classes = isActive ? "font-semibold text-slate-900" : "hover:text-slate-900";
      return `<a href="${item.href}" class="${classes}">${item.label}</a>`;
    })
    .join("");

  header.innerHTML = `
    <div class="w-full mx-auto max-w-6xl px-5 sm:px-6">
      <div class="flex items-center justify-between gap-4 py-5">
        <a href="/" class="group inline-flex items-center gap-3">
          <div class="leading-tight">
            <div class="text-md font-semibold tracking-tight text-slate-900 group-hover:text-emerald-950">Doug Gough</div>
            <div class="text-sm text-slate-600">Ongoing Website Care for Churches</div>
          </div>
        </a>

        <nav class="hidden md:flex gap-6 text-sm text-slate-700">
          ${navLinks}
        </nav>

        <div id="start_button" class="flex items-center gap-3" style="${isContactPage ? 'display: none;' : ''}">
          <a href="/contact"
             class="hidden sm:inline-flex items-center justify-center rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-950/10 hover:bg-emerald-950">
            Start a Conversation
          </a>
          <button class="inline-flex md:hidden items-center justify-center rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Menu
          </button>
        </div>
      </div>
    </div>
  `;
})();
