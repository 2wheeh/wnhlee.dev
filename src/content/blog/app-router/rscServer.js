// rsc.js - 8081 port // [!code highlight]
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    await sendJSX(res, <Router url={url} />); // [!code highlight]
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.end();
  }
}).listen(8081);

async function sendJSX(res, jsx) { // [!code highlight]
  const clientJSX = await renderJSXToClientJSX(jsx); // [!code highlight]
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
  res.setHeader("Content-Type", "application/json");
  res.end(clientJSXString);
}

async function renderJSXToClientJSX(jsx) { // [!code highlight]
  if (
    typeof jsx === "string" ||
    typeof jsx === "number" ||
    typeof jsx === "boolean" ||
    jsx == null
  ) {
    // 따로 처리할 필요 없음
    return jsx;
  } else if (Array.isArray(jsx)) {
    // 배열인 경우, 요소 하나 씩 재귀적으로 처리
    return Promise.all(jsx.map(child => renderJSXToClientJSX(child)));
  } else if (jsx != null && typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        // <div /> 같은 HTML 요소들인 경우.
        return {
          ...jsx,
          props: await renderJSXToClientJSX(jsx.props),
        };
      } else if (typeof jsx.type === "function") { // [!code highlight]
        // 우리가 작성한 리액트 컴포넌트들 (ex. <Footer />) // [!code highlight]
        const Component = jsx.type; // [!code highlight]
        const props = jsx.props; // [!code highlight]
        const returnedJsx = await Component(props); // [!code highlight]
        // 재귀적으로 자식 컴포넌트까지 모두 처리 // [!code highlight]
        return renderJSXToClientJSX(returnedJsx); // [!code highlight]
      } else throw new Error("Not implemented.");
    } else {
      return Object.fromEntries(
        await Promise.all(
          Object.entries(jsx).map(async ([propName, value]) => [
            propName,
            await renderJSXToClientJSX(value),
          ])
        )
      );
    }
  } else throw new Error("Not implemented");
}
