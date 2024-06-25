// client.js // [!code highlight]
window.addEventListener(
  "click",
  e => {
    if (e.target.tagName !== "A") {
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const href = e.target.getAttribute("href");
    if (!href.startsWith("/")) {
      return;
    }
    e.preventDefault(); // [!code highlight]
    window.history.pushState(null, null, href);
    navigate(href); // [!code highlight]
  },
  true
);
