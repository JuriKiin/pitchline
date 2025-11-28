'use client';

import { DragEvent, useEffect, useState, useRef } from 'react';
import type { Player } from '@/app/lib/types';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface PlayerTokenProps {
  player: Player;
  oldPosition: { x: number; y: number };
  onMouseDown: () => void;
  onTouchStart: () => void;
  isDragged: boolean;
  onDrop: (e: DragEvent) => void;
}

export default function PlayerToken({ player, oldPosition, onMouseDown, onTouchStart, isDragged, onDrop }: PlayerTokenProps) {
  const [position, setPosition] = useState(oldPosition);
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect handles the animation.
    // We instantly move the element to its *old* position, then transition to the new one.
    if (tokenRef.current) {
        tokenRef.current.style.transition = 'none'; // Disable transitions
        tokenRef.current.style.left = `calc(${oldPosition.x}% - 2rem)`;
        tokenRef.current.style.top = `calc(${oldPosition.y}% - 2rem)`;
        
        // Force a reflow to apply the initial position before the transition starts
        // This is a common trick to make sure the transition doesn't get skipped by the browser.
        tokenRef.current.getBoundingClientRect(); 

        // Now, enable transitions and set the final position.
        tokenRef.current.style.transition = 'left 0.3s ease-in-out, top 0.3s ease-in-out, transform 0.2s ease';
        setPosition(player.position);
    }
  }, [player.position, oldPosition]);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("playerId", player.id);
  };
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={tokenRef}
      key={player.id}
      data-player-id={player.id}
      className={cn(
        'absolute w-16 h-16 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center text-center p-1 shadow-lg cursor-grab select-none',
        isDragged && 'cursor-grabbing shadow-2xl scale-110 z-10'
      )}
      style={{
        left: `calc(${position.x}% - 2rem)`,
        top: `calc(${position.y}% - 2rem)`,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      title={player.name}
      draggable
      onDragStart={handleDragStart}
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <User className="w-5 h-5 mb-0.5" />
      <span className="text-xs font-medium leading-tight truncate w-full px-1">{player.positionName}</span>
    </div>
  );
}
