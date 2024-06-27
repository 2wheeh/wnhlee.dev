// client.js // [!code highlight]
async function fetchClientJSX(pathname) {
  const response = await fetch(pathname + "?jsx"); // [!code highlight]
  const clientJSXString = await response.text();
  const clientJSX = JSON.parse(clientJSXString, parseJSX);
  return clientJSX;
}

async function navigate(pathname) {
  currentPathname = pathname;
  const clientJSX = await fetchClientJSX(pathname); // [!code highlight]
  if (pathname === currentPathname) {
    root.render(clientJSX); // [!code highlight]
  }
}
