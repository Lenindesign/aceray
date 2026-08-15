import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Pause, Play, X, ZoomIn, ZoomOut } from "lucide-react";

// ── Modal Isolation Hook ──────────────────────────────────────
const modalLayerStack = [];
const isolatedElementStates = new Map();
let originalBodyOverflow = null;

function restoreIsolatedElements() {
  isolatedElementStates.forEach(({ ariaHidden, inert }, element) => {
    element.inert = inert;
    if (ariaHidden === null) element.removeAttribute("aria-hidden");
    else element.setAttribute("aria-hidden", ariaHidden);
  });
  isolatedElementStates.clear();
}

function updateModalIsolation() {
  restoreIsolatedElements();

  const activeLayer = modalLayerStack[modalLayerStack.length - 1];
  if (!activeLayer) {
    if (originalBodyOverflow !== null) {
      document.body.style.overflow = originalBodyOverflow;
      originalBodyOverflow = null;
    }
    return;
  }

  const activeBodyChild = Array.from(document.body.children)
    .find((element) => element === activeLayer || element.contains(activeLayer));

  if (!activeBodyChild) return;
  if (originalBodyOverflow === null) originalBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  Array.from(document.body.children).forEach((element) => {
    if (element === activeBodyChild) return;
    isolatedElementStates.set(element, {
      ariaHidden: element.getAttribute("aria-hidden"),
      inert: element.inert,
    });
    element.inert = true;
    element.setAttribute("aria-hidden", "true");
  });
}

function useModalIsolation(open, dialogRef) {
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    modalLayerStack.push(dialog);
    updateModalIsolation();

    return () => {
      const layerIndex = modalLayerStack.lastIndexOf(dialog);
      if (layerIndex >= 0) modalLayerStack.splice(layerIndex, 1);
      updateModalIsolation();
    };
  }, [dialogRef, open]);
}

// ── Prefers Reduced Motion Hook ──────────────────────────────
const reducedMotionMediaQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange) {
  if (typeof window === "undefined") return () => undefined;
  const mediaQuery = window.matchMedia(reducedMotionMediaQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionPreference() {
  return typeof window !== "undefined" && window.matchMedia(reducedMotionMediaQuery).matches;
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false
  );
}

// ── Fullscreen Image Viewer Component ─────────────────────────
export function FullscreenImageViewer({
  images = [],
  initialIndex = 0,
  title = "Gallery",
  designer = null,
  onClose
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const dialogRef = useRef(null);
  const wheelStageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const controlsTimerRef = useRef(null);
  const pointerPositionsRef = useRef(new Map());
  const swipeStartRef = useRef(null);
  const swipeLastRef = useRef(null);
  const dragStartRef = useRef(null);
  const pinchStartRef = useRef(null);
  const lastTapRef = useRef(null);
  const wheelGestureRef = useRef(null);
  const wheelResetTimerRef = useRef(null);
  const wheelCooldownUntilRef = useRef(0);
  
  const hasMultipleImages = images.length > 1;

  useModalIsolation(true, dialogRef);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setZoomOrigin("50% 50%");
  }, []);

  const resetSwipe = useCallback(() => {
    swipeStartRef.current = null;
    swipeLastRef.current = null;
    dragStartRef.current = null;
    pinchStartRef.current = null;
    wheelGestureRef.current = null;
    if (wheelResetTimerRef.current) {
      clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = null;
    }
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  const selectImage = useCallback((nextIndex) => {
    const normalizedIndex = (nextIndex + images.length) % images.length;
    if (normalizedIndex === activeIndex) return;
    setActiveIndex(normalizedIndex);
    resetSwipe();
    resetTransform();
  }, [activeIndex, images.length, resetSwipe, resetTransform]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2800);
  }, []);

  const setClampedZoom = useCallback((nextZoom) => {
    const clampedZoom = Math.min(4, Math.max(1, nextZoom));
    setZoom(clampedZoom);
    if (clampedZoom === 1) setOffset({ x: 0, y: 0 });
  }, []);

  const toggleTapZoom = useCallback((clientX, clientY) => {
    if (zoom <= 1) {
      setZoomOrigin(`${(clientX / window.innerWidth) * 100}% ${(clientY / window.innerHeight) * 100}%`);
    }
    setClampedZoom(zoom > 1 ? 1 : 2.5);
    if (zoom > 1) {
      setOffset({ x: 0, y: 0 });
      setZoomOrigin("50% 50%");
    }
  }, [setClampedZoom, zoom]);

  useEffect(() => {
    if (playing) return;
    const frame = window.requestAnimationFrame(showControls);
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, playing, showControls]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing || prefersReducedMotion || !hasMultipleImages) return;
    const intervalId = window.setInterval(() => selectImage(activeIndex + 1), 6500);
    return () => window.clearInterval(intervalId);
  }, [activeIndex, hasMultipleImages, playing, prefersReducedMotion, selectImage]);

  const getPointerDistance = useCallback(() => {
    const points = Array.from(pointerPositionsRef.current.values());
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }, []);

  const handlePointerDown = useCallback((event) => {
    if (event.button !== 0) return;

    showControls();
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    swipeLastRef.current = { x: event.clientX, y: event.clientY };

    if (pointerPositionsRef.current.size === 1) {
      if (zoom > 1) {
        dragStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: event.timeStamp,
          offsetX: offset.x,
          offsetY: offset.y,
        };
      } else {
        swipeStartRef.current = {
          x: event.clientX,
          y: event.clientY,
          time: event.timeStamp,
        };
        setIsDragging(true);
      }
    } else if (pointerPositionsRef.current.size === 2) {
      pinchStartRef.current = { distance: getPointerDistance(), zoom };
    }
  }, [getPointerDistance, offset.x, offset.y, showControls, zoom]);

  const handlePointerMove = useCallback((event) => {
    if (!pointerPositionsRef.current.has(event.pointerId)) return;
    pointerPositionsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    swipeLastRef.current = { x: event.clientX, y: event.clientY };

    if (pointerPositionsRef.current.size === 2 && pinchStartRef.current) {
      const ratio = getPointerDistance() / Math.max(1, pinchStartRef.current.distance);
      setClampedZoom(pinchStartRef.current.zoom * ratio);
      return;
    }

    if (zoom > 1 && dragStartRef.current) {
      event.preventDefault();
      setOffset({
        x: dragStartRef.current.offsetX + (event.clientX - dragStartRef.current.x),
        y: dragStartRef.current.offsetY + (event.clientY - dragStartRef.current.y),
      });
      return;
    }

    const start = swipeStartRef.current;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) return;

    event.preventDefault();
    const maxOffset = event.currentTarget.clientWidth * 0.22;
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
  }, [getPointerDistance, setClampedZoom, zoom]);

  const handlePointerUp = useCallback((event) => {
    const start = swipeStartRef.current;
    const dragStart = dragStartRef.current;
    const end = swipeLastRef.current ?? {
      x: event.clientX,
      y: event.clientY,
    };
    const origin = start ?? dragStart;

    if (!origin) {
      if (event.currentTarget.releasePointerCapture) {
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore release errors
        }
      }
      pointerPositionsRef.current.delete(event.pointerId);
      if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
      if (pointerPositionsRef.current.size === 0) swipeStartRef.current = null;
      return;
    }

    const deltaX = end.x - origin.x;
    const deltaY = end.y - origin.y;
    const elapsed = Math.max(event.timeStamp - origin.time, 1);

    if (zoom > 1 && dragStart) {
      const isTap = Math.hypot(deltaX, deltaY) < 12 && elapsed < 360;
      if (isTap) {
        const lastTap = lastTapRef.current;
        const isDoubleTap = Boolean(
          lastTap &&
          event.timeStamp - lastTap.time < 320 &&
          Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 44
        );
        if (isDoubleTap) {
          toggleTapZoom(event.clientX, event.clientY);
          lastTapRef.current = null;
        } else {
          showControls();
          lastTapRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
        }
      }
    } else if (start) {
      const velocity = Math.abs(deltaX) / elapsed;
      const threshold = Math.min(64, event.currentTarget.clientWidth * 0.14);
      const isHorizontalSwipe =
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2 &&
        (Math.abs(deltaX) >= threshold || (Math.abs(deltaX) >= 24 && velocity >= 0.45));

      if (isHorizontalSwipe && hasMultipleImages) {
        selectImage(activeIndex + (deltaX < 0 ? 1 : -1));
      } else {
        const isTap = Math.hypot(deltaX, deltaY) < 12 && elapsed < 360;
        if (isTap) {
          const lastTap = lastTapRef.current;
          const isDoubleTap = Boolean(
            lastTap &&
            event.timeStamp - lastTap.time < 320 &&
            Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 44
          );
          if (isDoubleTap) {
            toggleTapZoom(event.clientX, event.clientY);
            lastTapRef.current = null;
          } else {
            showControls();
            lastTapRef.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
          }
        }
      }
      setDragOffset(0);
      setIsDragging(false);
    }

    if (event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors
      }
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) {
      swipeStartRef.current = null;
      dragStartRef.current = null;
    }
  }, [activeIndex, hasMultipleImages, selectImage, showControls, toggleTapZoom, zoom]);

  const handlePointerCancel = useCallback((event) => {
    if (event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors
      }
    }
    pointerPositionsRef.current.delete(event.pointerId);
    if (pointerPositionsRef.current.size < 2) pinchStartRef.current = null;
    if (pointerPositionsRef.current.size === 0) {
      resetSwipe();
    }
  }, [resetSwipe]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && hasMultipleImages) selectImage(activeIndex - 1);
      if (event.key === "ArrowRight" && hasMultipleImages) selectImage(activeIndex + 1);
      if (event.key === "+" || event.key === "=") setClampedZoom(zoom + 0.35);
      if (event.key === "-") setClampedZoom(zoom - 0.35);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, hasMultipleImages, onClose, selectImage, setClampedZoom, zoom]);

  const handleWheel = useCallback((event) => {
    const width = wheelStageRef.current?.clientWidth ?? window.innerWidth;
    const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width : 1;
    const deltaX = event.deltaX * deltaScale;
    const deltaY = event.deltaY * deltaScale;
    const isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 4;

    if (!isHorizontalGesture || zoom > 1 || !hasMultipleImages) {
      event.preventDefault();
      setClampedZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
      return;
    }

    event.preventDefault();
    showControls();

    const now = performance.now();
    if (now < wheelCooldownUntilRef.current) return;

    if (!wheelGestureRef.current || now - wheelGestureRef.current.lastTime > 240) {
      wheelGestureRef.current = { offsetX: 0, lastTime: now };
    }

    wheelGestureRef.current.offsetX += deltaX;
    wheelGestureRef.current.lastTime = now;

    const threshold = Math.min(64, width * 0.14);
    const maxOffset = width * 0.22;
    const visualOffset = Math.max(-maxOffset, Math.min(maxOffset, -wheelGestureRef.current.offsetX));
    setIsDragging(true);
    setDragOffset(visualOffset);

    if (Math.abs(wheelGestureRef.current.offsetX) >= threshold) {
      const direction = wheelGestureRef.current.offsetX > 0 ? 1 : -1;
      wheelCooldownUntilRef.current = now + 650;
      selectImage(activeIndex + direction);
      return;
    }

    if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
    wheelResetTimerRef.current = setTimeout(() => {
      wheelGestureRef.current = null;
      wheelResetTimerRef.current = null;
      setIsDragging(false);
      setDragOffset(0);
    }, 180);
  }, [activeIndex, hasMultipleImages, selectImage, setClampedZoom, showControls, zoom]);

  useEffect(() => {
    const stage = wheelStageRef.current;
    if (!stage) return;

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const chromeVisible = controlsVisible;
  
  const controlButtonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black/80 border border-black/10 shadow-md backdrop-blur-lg transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#718f80]/50";
  
  const slideTransitionClass = isDragging || zoom > 1
    ? "transition-none"
    : "transition-transform duration-300 ease-out motion-reduce:transition-none";
  
  const trackTransform = `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`;

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[99999] flex touch-none items-center justify-center overflow-hidden bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen gallery for ${title}`}
      onMouseMove={showControls}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={wheelStageRef}
        className="absolute inset-0 h-full w-full overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={`flex h-full w-full ${slideTransitionClass}`}
          style={{ transform: trackTransform }}
        >
          {images.map((item, index) => {
            const src = typeof item === 'string' ? item : (item.src || item.url);
            const itemTitle = typeof item === 'object' && item.title ? item.title : title;
            const isActive = index === activeIndex;
            return (
              <div
                key={typeof item === 'string' ? `${src}-${index}` : (item._id || `${src}-${index}`)}
                className="relative h-full w-full shrink-0 overflow-hidden flex items-center justify-center"
                aria-hidden={!isActive}
              >
                <img
                  src={src}
                  alt={isActive ? itemTitle : ""}
                  className={`select-none object-contain max-w-full max-h-full ${
                    isActive && (zoom > 1 ? "cursor-grab active:cursor-grabbing" : hasMultipleImages ? "cursor-ew-resize" : "cursor-zoom-in")
                  }`}
                  style={{
                    transform: isActive
                      ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`
                      : undefined,
                    transformOrigin: zoomOrigin,
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      {(() => {
        const currentItem = images[activeIndex];
        const displayTitle = typeof currentItem === 'object' && currentItem.title ? currentItem.title : title;
        const displayDesigner = typeof currentItem === 'object' && currentItem.designer !== undefined ? currentItem.designer : designer;

        return (
          <div className={`pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between gap-4 transition-opacity duration-300 motion-reduce:transition-none ${
            chromeVisible ? "opacity-100" : "opacity-0"
          }`}>
            {/* Product name + designer — top left with explicit padding and spacious layout */}
            <div className="pointer-events-auto flex items-center gap-4 min-w-0">
              <div
                className="bg-white/95 shadow-lg backdrop-blur-xl border border-black/15 min-w-0"
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <h2
                  className="font-semibold text-[var(--color-text-main)] tracking-[0.08em] uppercase truncate max-w-[280px] sm:max-w-[460px] text-base leading-normal m-0"
                >
                  {displayTitle}
                </h2>
                {displayDesigner && (
                  <p
                    className="font-medium text-[var(--color-primary)] tracking-[0.08em] uppercase truncate max-w-[280px] sm:max-w-[460px] text-xs leading-normal mt-1.5"
                  >
                    Design by {displayDesigner}
                  </p>
                )}
              </div>
              <div
                className="pointer-events-auto inline-flex items-center whitespace-nowrap bg-white/95 shadow-lg backdrop-blur-xl text-black/70 border border-black/15 font-semibold"
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                }}
              >
                {activeIndex + 1} / {images.length}
              </div>
            </div>
            {/* Controls — top right */}
            <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
              <button type="button" className={controlButtonClass} onClick={() => setClampedZoom(zoom - 0.35)} aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button type="button" className={controlButtonClass} onClick={() => setClampedZoom(zoom + 0.35)} aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
              {hasMultipleImages ? (
                <button
                  type="button"
                  className={controlButtonClass}
                  onClick={() => setPlaying((value) => !value)}
                  aria-label={prefersReducedMotion
                    ? "Slideshow disabled because reduced motion is enabled"
                    : playing
                      ? "Pause slideshow"
                      : "Play slideshow"}
                  aria-pressed={playing}
                  disabled={prefersReducedMotion}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              ) : null}
              <button
                type="button"
                className={controlButtonClass}
                onClick={onClose}
                aria-label="Close fullscreen gallery"
                autoFocus
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })()}

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-black/80 border border-black/10 shadow-md backdrop-blur-lg transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#718f80]/50 absolute left-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 motion-reduce:transition-none ${
              chromeVisible ? "opacity-100 cursor-pointer" : "pointer-events-none opacity-0"
            }`}
            onClick={() => selectImage(activeIndex - 1)}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-black/80 border border-black/10 shadow-md backdrop-blur-lg transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#718f80]/50 absolute right-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 motion-reduce:transition-none ${
              chromeVisible ? "opacity-100 cursor-pointer" : "pointer-events-none opacity-0"
            }`}
            onClick={() => selectImage(activeIndex + 1)}
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div className={`pointer-events-none absolute inset-x-6 bottom-6 flex flex-col items-center gap-3 transition-opacity duration-300 motion-reduce:transition-none ${
        chromeVisible ? "opacity-100" : "opacity-0"
      }`}>
        {hasMultipleImages ? (
          <div
            className="pointer-events-auto flex max-w-full snap-x snap-mandatory overflow-x-auto bg-white/95 shadow-2xl border border-black/15 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center"
            style={{
              padding: '20px 28px',
              borderRadius: '20px',
              gap: '16px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.14)',
            }}
          >
            {images.map((item, index) => {
              const src = typeof item === 'string' ? item : (item.src || item.url);
              const itemTitle = typeof item === 'object' && item.title ? item.title : title;
              return (
                <button
                  key={typeof item === 'string' ? `${src}-${index}` : (item._id || `${src}-${index}`)}
                  type="button"
                  className={`relative shrink-0 snap-start overflow-hidden rounded-lg transition-all motion-reduce:transition-none ${
                    index === activeIndex ? "ring-2 ring-[#718f80] opacity-100 scale-105 shadow-md" : "ring-1 ring-black/15 opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    width: '84px',
                    height: '50px',
                    padding: '3px',
                    backgroundColor: '#ffffff',
                    display: 'block',
                  }}
                  onClick={() => selectImage(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  <img src={src} alt={itemTitle ? `${itemTitle} photo ${index + 1}` : `Photo ${index + 1}`} className="w-full h-full object-cover rounded-md block" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
