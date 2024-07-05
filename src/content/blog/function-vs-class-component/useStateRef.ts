import { useCallback, useRef, useState, type MutableRefObject } from "react";

export function useStateRef<T>(
  defaultValue: T
): [T, (value: T) => void, MutableRefObject<T>] {
  const [state, setState] = useState(defaultValue);
  const ref = useRef(state);
  const dispatch = useCallback((value: T) => {
    ref.current = typeof value === "function" ? value(ref.current) : value;
    setState(ref.current);
  }, []);
  return [state, dispatch, ref];
}
