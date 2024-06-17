import { useInView } from "react-intersection-observer";
import { useEffect, useState, Suspense } from "react";

// TODO: type to ensure children is imported by React.lazy
export const LazyLoader = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true);
    }
  }, [inView]);

  return <div ref={ref}>{isLoaded && <Suspense>{children}</Suspense>}</div>;
};
