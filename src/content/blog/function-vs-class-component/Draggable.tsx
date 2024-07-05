import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { useStateRef } from "./useStateRef";

function getTouchEventData(
  e:
    | globalThis.TouchEvent
    | globalThis.MouseEvent
    | TouchEvent<HTMLElement>
    | MouseEvent<HTMLElement>
) {
  return "changedTouches" in e ? e.changedTouches[0] : e;
}

function DraggableInner({ containerWidth }: { containerWidth: number }) {
  const [currentX, setCurrentX] = useState(0);
  const [passedThreshold, setPassedThreshold] = useState(false);
  const draggableRef = useRef<HTMLDivElement>(null);

  const threshold = 0.3 * containerWidth;

  const maxOffsetX = containerWidth - 72;
  let initialOffsetX: number;
  let touchStartX: number;

  const onTouchStart = (e: globalThis.TouchEvent | globalThis.MouseEvent) => {
    initialOffsetX = currentX;
    touchStartX = getTouchEventData(e).clientX;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onTouchEnd);
  };

  // https://github.com/withastro/astro/issues/10851
  // onTouchStart가 Safari, IOS에서 hydrate 되지 않는 Astro 이슈.
  // 직접 DOM에 이벤트 추가해야함
  useEffect(() => {
    if (!draggableRef.current) return;
    draggableRef.current.addEventListener("touchstart", onTouchStart);
    draggableRef.current.addEventListener("mousedown", onTouchStart);

    return () => {
      if (!draggableRef.current) return;
      draggableRef.current.removeEventListener("touchstart", onTouchStart);
      draggableRef.current.removeEventListener("mousedown", onTouchStart);
    };
  }, [onTouchStart]);

  const onTouchMove = (e: globalThis.TouchEvent | globalThis.MouseEvent) => {
    const currentTouchX = getTouchEventData(e).clientX;
    const swipeDiff = touchStartX - currentTouchX;
    let newOffsetX = initialOffsetX - swipeDiff;

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < 0) {
      newOffsetX = 0;
    }

    setCurrentX(newOffsetX);
  };

  const onTouchEnd = () => {
    setPassedThreshold(currentX > threshold);

    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mousemove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("mouseup", onTouchEnd);
  };

  return (
    <div
      ref={draggableRef}
      className="h-14 w-14 rounded border border-skin-accent hover:cursor-pointer"
      style={{
        transform: `translateX(${currentX}px)`,
        backgroundColor: passedThreshold ? "skyblue" : "beige",
      }}
    />
  );
}

export function Draggable() {
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const { width } = wrapperRef.current.getBoundingClientRect();
    setContainerWidth(width);
  }, [wrapperRef.current]);

  return (
    <div
      ref={wrapperRef}
      className="h-fit w-full space-y-2 rounded border border-skin-accent p-2"
    >
      {containerWidth > 0 && <DraggableInner containerWidth={containerWidth} />}
    </div>
  );
}

function DraggableInnerGood({ containerWidth }: { containerWidth: number }) {
  const [currentX, setCurrentX, currentXRef] = useStateRef(0);
  const [passedThreshold, setPassedThreshold] = useState(false);
  const draggableRef = useRef<HTMLDivElement>(null);

  const threshold = 0.3 * containerWidth;

  const maxOffsetX = containerWidth - 72;
  let initialOffsetX: number;
  let touchStartX: number;

  const onTouchStart = (e: globalThis.TouchEvent | globalThis.MouseEvent) => {
    initialOffsetX = currentX;
    touchStartX = getTouchEventData(e).clientX;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onTouchEnd);
  };

  // https://github.com/withastro/astro/issues/10851
  // onTouchStart가 Safari, IOS에서 hydrate 되지 않는 Astro 이슈.
  // 직접 DOM에 이벤트 추가해야함
  useEffect(() => {
    if (!draggableRef.current) return;
    draggableRef.current.addEventListener("touchstart", onTouchStart);
    draggableRef.current.addEventListener("mousedown", onTouchStart);

    return () => {
      if (!draggableRef.current) return;
      draggableRef.current.removeEventListener("touchstart", onTouchStart);
      draggableRef.current.removeEventListener("mousedown", onTouchStart);
    };
  }, [onTouchStart]);

  const onTouchMove = (e: globalThis.TouchEvent | globalThis.MouseEvent) => {
    const currentTouchX = getTouchEventData(e).clientX;
    const swipeDiff = touchStartX - currentTouchX;
    let newOffsetX = initialOffsetX - swipeDiff;

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < 0) {
      newOffsetX = 0;
    }

    setCurrentX(newOffsetX);
  };

  const onTouchEnd = () => {
    setPassedThreshold(currentXRef.current > threshold);

    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mousemove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("mouseup", onTouchEnd);
  };

  return (
    <div
      ref={draggableRef}
      className="h-14 w-14 rounded border border-skin-accent hover:cursor-pointer"
      style={{
        transform: `translateX(${currentX}px)`,
        backgroundColor: passedThreshold ? "skyblue" : "beige",
      }}
    />
  );
}

export function DraggableGood() {
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const { width } = wrapperRef.current.getBoundingClientRect();
    setContainerWidth(width);
  }, [wrapperRef.current]);

  return (
    <div
      ref={wrapperRef}
      className="h-fit w-full space-y-2 rounded border border-skin-accent p-2"
    >
      {containerWidth > 0 && (
        <DraggableInnerGood containerWidth={containerWidth} />
      )}
    </div>
  );
}
