'use client';

import { DragEvent, useEffect, useRef } from 'react';
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
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect handles the animation.
    // We instantly move the element to its *old* position, then transition to the new one.
    if (tokenRef.current) {
        tokenRef.current.style.transition = 'none'; // Disable transitions
        tokenRef.current.style.left = `calc(${oldPosition.x}% - 2rem)`;
        tokenRef.current.style.top = `calc(${oldPosition.y}% - 2rem)`;
        
        // Force a reflow to apply the initial position before the transition starts
        tokenRef.current.getBoundingClientRect(); 

        // Now, enable transitions and set the final position.
        tokenRef.current.style.transition = 'left 0.3s ease-in-out, top 0.3s ease-in-out, transform 0.2s ease, background-color 0.2s ease-in-out';
        tokenRef.current.style.left = `calc(${player.position.x}% - 2rem)`;
        tokenRef.current.style.top = `calc(${player.position.y}% - 2rem)`;
    }
  }, [player.position, oldPosition]);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("playerId", player.id);
    // Add a slight delay to allow the ghost image to be created
    setTimeout(() => {
        if(tokenRef.current) {
            tokenRef.current.style.opacity = '0.5';
        }
    }, 0);
  };
  
  const handleDragEnd = () => {
    if(tokenRef.current) {
        tokenRef.current.style.opacity = '1';
    }
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
        'hover:bg-primary/80',
        isDragged && 'cursor-grabbing shadow-2xl scale-110 z-10'
      )}
      style={{
        left: `calc(${player.position.x}% - 2rem)`,
        top: `calc(${player.position.y}% - 2rem)`,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      title={player.name}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <User className="w-5 h-5 mb-0.5" />
      <span className="text-xs font-medium leading-tight truncate w-full px-1">{player.positionName}</span>
    </div>
  );
}
