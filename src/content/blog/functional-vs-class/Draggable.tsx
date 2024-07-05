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

  const threshold = 0.3 * containerWidth;

  const maxOffsetX = containerWidth - 72;
  let initialOffsetX: number;
  let touchStartX: number;

  const onTouchStart = (
    e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
  ) => {
    initialOffsetX = currentX;
    touchStartX = getTouchEventData(e).clientX;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onTouchEnd);
  };

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
      onTouchStart={onTouchStart}
      onMouseDown={onTouchStart}
      className="h-14 w-14 rounded border border-skin-accent hover:cursor-pointer"
      style={{
        transform: `translateX(${currentX}px)`,
        backgroundColor: passedThreshold ? "skyblue" : "beige",
      }}
    />
  );
}

export function Draggable() {
  const [containerWith, setcontainerWith] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const { width } = wrapperRef.current.getBoundingClientRect();
    setcontainerWith(width);
  }, [wrapperRef.current]);

  return (
    <div
      ref={wrapperRef}
      className="h-fit w-full space-y-2 rounded border border-skin-accent p-2"
    >
      <DraggableInner containerWidth={containerWith} />
    </div>
  );
}

function DraggableInnerGood({ containerWidth }: { containerWidth: number }) {
  const [currentX, setCurrentX, currentXRef] = useStateRef(0);
  const [passedThreshold, setPassedThreshold] = useState(false);

  const threshold = 0.3 * containerWidth;

  const maxOffsetX = containerWidth - 72;
  let initialOffsetX: number;
  let touchStartX: number;

  const onTouchStart = (
    e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
  ) => {
    initialOffsetX = currentX;
    touchStartX = getTouchEventData(e).clientX;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onTouchEnd);
  };

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
      onTouchStart={onTouchStart}
      onMouseDown={onTouchStart}
      className="h-14 w-14 rounded border border-skin-accent hover:cursor-pointer"
      style={{
        transform: `translateX(${currentX}px)`,
        backgroundColor: passedThreshold ? "skyblue" : "beige",
      }}
    />
  );
}

export function DraggableGood() {
  const [containerWith, setcontainerWith] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const { width } = wrapperRef.current.getBoundingClientRect();
    setcontainerWith(width);
  }, [wrapperRef.current]);

  return (
    <div
      ref={wrapperRef}
      className="h-fit w-full space-y-2 rounded border border-skin-accent p-2"
    >
      <DraggableInnerGood containerWidth={containerWith} />
    </div>
  );
}
