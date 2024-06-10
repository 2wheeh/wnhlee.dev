import type { Node } from "unist";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

interface ImageNode extends Node {
  alt?: string;
  data?: {
    hProperties?: {
      className?: string[];
    };
  };
}

// TODO: proper typing
export function remarkInvertImages(): Transformer<any, any> {
  return tree => {
    visit(tree, "image", (node: ImageNode) => {
      if (node.alt && node.alt.startsWith("invert")) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.className = (
          node.data.hProperties.className || []
        ).concat("inverted");
      }
    });
  };
}
