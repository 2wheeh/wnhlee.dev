import { useEffect, useRef } from "react";
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

let nextId = 0;
const ID_PREFIX = "stackblitz-embed-";

export default function StackBlitzImpl({
  id,
  file,
  view,
  hideExplorer = false,
  height = 600,
  theme = "dark",
  clickToLoad = false,
}: StackBlitzProps) {
  const elementIdRef = useRef(`${ID_PREFIX}${nextId++}`);

  useEffect(() => {
    sdk.embedGithubProject(elementIdRef.current, id, {
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

  return <div id={elementIdRef.current} />;
}
