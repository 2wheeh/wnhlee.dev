// ssr.js - 8080 port // [!code highlight]
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/client.js") {
      const content = await readFile("./client.js", "utf8");
      res.setHeader("Content-Type", "text/javascript");
      res.end(content);
      return;
    }
    const response = await fetch("http://127.0.0.1:8081" + url.pathname); // [!code highlight]
    if (!response.ok) {
      res.statusCode = response.status;
      res.end();
      return;
    }
    const clientJSXString = await response.text(); // [!code highlight]
    if (url.searchParams.has("jsx")) {
      // [!code highlight]
      res.setHeader("Content-Type", "application/json");
      res.end(clientJSXString); // [!code highlight]
    } else {
      // ...
    }
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.end();
  }
}).listen(8080);
