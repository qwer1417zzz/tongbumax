import { useState, useRef, useEffect, TouchEvent, MouseEvent } from 'react';

interface CardSwiperProps {
  images: string[];
  onCardClick?: (index: number) => void;
}

const CardSwiper = ({ images, onCardClick }: CardSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardWidth = 260;
  const gap = 16;
  const totalCardWidth = cardWidth + gap;

  // 计算卡片位置和样式
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const baseTranslate = diff * totalCardWidth + translateX;
    
    // 计算缩放和透明度
    const absDistance = Math.abs(diff - translateX / totalCardWidth);
    const scale = Math.max(0.88, 1 - absDistance * 0.12);
    const opacity = Math.max(0.6, 1 - absDistance * 0.3);
    const brightness = Math.max(0.85, 1 - absDistance * 0.15);
    const zIndex = 10 - Math.abs(diff);

    return {
      transform: `translateX(${baseTranslate}px) scale(${scale})`,
      opacity,
      filter: `brightness(${brightness})`,
      zIndex,
    };
  };

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 判断滑动方向和距离
    const threshold = totalCardWidth * 0.3;
    
    if (translateX < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (translateX > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTranslateX(0);
  };

  // Touch 事件处理
  const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  // Mouse 事件处理（桌面端）
  const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  // 指示器
  const renderDots = () => (
    <div className="flex justify-center gap-2 mt-6">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ease-ios ${
            index === currentIndex 
              ? 'bg-foreground w-6' 
              : 'bg-foreground/30'
          }`}
          aria-label={`跳转到第 ${index + 1} 张图片`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="relative flex items-center justify-center min-h-[420px] touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute swiper-card"
            style={{
              width: cardWidth,
              height: 380,
              transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              ...getCardStyle(index),
            }}
            onClick={() => !isDragging && onCardClick?.(index)}
          >
            <img
              src={image}
              alt={`卡片 ${index + 1}`}
              className="w-full h-full object-cover rounded-card"
              draggable={false}
            />
          </div>
        ))}
      </div>
      {renderDots()}
    </div>
  );
};

export default CardSwiper;
