import { lazy } from "react";
import { LazyLoader } from "./LazyLoader";
import type { StackBlitzProps } from "./StackblitzImpl";

const StackBlitzImpl = lazy(() => import("./StackblitzImpl"));

export const StackBlitz = (props: StackBlitzProps) => {
  return (
    <LazyLoader>
      <StackBlitzImpl {...props} />
    </LazyLoader>
  );
};
