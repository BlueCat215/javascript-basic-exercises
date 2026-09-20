import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "../icons";
import { imageUrl } from "../../utils/imageUrl";

const POSITION_KEY = "promoBubblePosition";
const DRAG_THRESHOLD = 6;
const BUBBLE_SIZE = 72;

export const PromoFloatingButton = ({ promoProduct, onClose }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const dragInfo = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  const clampPosition = (x, y) => {
    const maxX = window.innerWidth - BUBBLE_SIZE - 8;
    const maxY = window.innerHeight - BUBBLE_SIZE - 8;
    return {
      x: Math.min(Math.max(8, x), Math.max(8, maxX)),
      y: Math.min(Math.max(8, y), Math.max(8, maxY)),
    };
  };

  const [position, setPosition] = useState(() => {
    try {
      const saved = sessionStorage.getItem(POSITION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return clampPosition(
      window.innerWidth - BUBBLE_SIZE - 16,
      window.innerHeight - BUBBLE_SIZE - 96,
    );
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(POSITION_KEY, JSON.stringify(position));
    } catch {
      // ignore
    }
  }, [position]);

  const handlePointerDown = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    dragInfo.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
    buttonRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragInfo.current.dragging) return;
    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragInfo.current.moved = true;
    }

    setPosition(
      clampPosition(
        dragInfo.current.originX + dx,
        dragInfo.current.originY + dy,
      ),
    );
  };

  const handlePointerUp = (e) => {
    if (!dragInfo.current.dragging) return;
    dragInfo.current.dragging = false;
    buttonRef.current.releasePointerCapture(e.pointerId);

    if (!dragInfo.current.moved) {
      navigate(promoProduct ? `/products/${promoProduct.id}` : "/products");
    }
  };

  return (
    <div
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none",
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
      }}
      className="fixed z-40 lg:hidden cursor-grab active:cursor-grabbing select-none"
    >
      <img
        src={imageUrl(promoProduct.image)}
        alt={promoProduct.title || "Sản phẩm khuyến mãi"}
        draggable={false}
        className="w-full h-full object-contain drop-shadow-xl pointer-events-none"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Đóng"
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-ink"
      >
        <CloseIcon size={10} />
      </button>
    </div>
  );
};
