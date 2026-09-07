import { useRef, useState } from 'react';

/**
 * Drag/swipe-to-rotate 360° viewer.
 *
 * Real 360° capture is normally 24-72 sequential frames shot on a turntable.
 * We don't have a frame sequence for demo products yet, so this component
 * cycles through the product's existing gallery photos as a stand-in —
 * the interaction (drag threshold -> frame index) is fully wired. To go
 * live, pass a `frames` array of 24-72 image URLs instead of `images` and
 * everything else here keeps working unchanged.
 */
export default function ProductViewer360({ images, name }) {
  const frames = images && images.length > 0 ? images : [];
  const [frameIndex, setFrameIndex] = useState(0);
  const dragState = useRef({ dragging: false, startX: 0, startFrame: 0 });

  const framesPerFullSwipe = 220; // px of drag mapped to one full loop

  const onPointerDown = (e) => {
    dragState.current = { dragging: true, startX: e.clientX, startFrame: frameIndex };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging || frames.length === 0) return;
    const delta = e.clientX - dragState.current.startX;
    const frameDelta = Math.round((delta / framesPerFullSwipe) * frames.length);
    let next = (dragState.current.startFrame + frameDelta) % frames.length;
    if (next < 0) next += frames.length;
    setFrameIndex(next);
  };

  const onPointerUp = () => {
    dragState.current.dragging = false;
  };

  if (frames.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted text-sm">
        360° frames not available for this product yet.
      </div>
    );
  }

  return (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <img src={frames[frameIndex]} alt={`${name} 360 view frame ${frameIndex + 1}`} draggable={false} className="w-full h-full object-cover pointer-events-none" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/70 text-warmwhite text-[10px] tracking-widest2 uppercase px-3 py-1.5 rounded-full">
        Drag to rotate
      </div>
    </div>
  );
}
