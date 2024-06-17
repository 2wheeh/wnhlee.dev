import { useEffect } from "react";
import sdk from "@stackblitz/sdk";

export interface StackBlitzProps {
  id: string;
  file: string;
  view?: "editor" | "preview";
  hideExplorer?: boolean;
  height?: number;
  theme?: "dark" | "light" | "default";
  clickToLoad?: boolean;
}

export default function StackBlitzImpl({
  id,
  file,
  view,
  hideExplorer = false,
  height = 600,
  theme = "dark",
  clickToLoad = false,
}: StackBlitzProps) {
  useEffect(() => {
    sdk.embedGithubProject("stackblitz-embed", id, {
      forceEmbedLayout: true,
      openFile: file,
      view,
      hideExplorer,
      hideNavigation: true,
      height,
      theme,
      clickToLoad,
    });
  }, []);

  return <div id="stackblitz-embed" />;
}
