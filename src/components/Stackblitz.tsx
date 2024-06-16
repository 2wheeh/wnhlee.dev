/** @jsxImportSource @builder.io/qwik */

import { component$, useVisibleTask$ } from "@builder.io/qwik";

interface Props {
  id: string;
  file: string;
  view?: "editor" | "preview";
  hideExplorer?: boolean;
  height?: number;
  theme?: "dark" | "light" | "default";
  clickToLoad?: boolean;
}

const StackBlitz = component$<Props>(
  ({
    id,
    file,
    view,
    hideExplorer = false,
    height = 600,
    theme = "dark",
    clickToLoad = false,
  }) => {
    useVisibleTask$(async () => {
      const sdk = (await import("@stackblitz/sdk")).default;

      sdk.embedProjectId("stackblitz-embed", id, {
        forceEmbedLayout: true,
        openFile: file,
        view,
        hideExplorer,
        hideNavigation: true,
        height,
        theme,
        clickToLoad,
      });
    });

    return <div id="stackblitz-embed" />;
  }
);

export default StackBlitz;
