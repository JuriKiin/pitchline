'use client';

import { DragEvent, useEffect, useRef, TouchEvent } from 'react';
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
  onTouchEnd: (e: TouchEvent) => void;
}

export default function PlayerToken({ player, oldPosition, onMouseDown, onTouchStart, isDragged, onDrop, onTouchEnd }: PlayerTokenProps) {
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect handles the animation.
    // We instantly move the element to its *old* position, then transition to the new one.
    if (tokenRef.current) {
        tokenRef.current.style.transition = 'none'; // Disable transitions
        tokenRef.current.style.left = `calc(${oldPosition.x}% - 2.25rem)`;
        tokenRef.current.style.top = `calc(${oldPosition.y}% - 2.25rem)`;
        
        // Force a reflow to apply the initial position before the transition starts
        tokenRef.current.getBoundingClientRect(); 

        // Now, enable transitions and set the final position.
        tokenRef.current.style.transition = 'left 0.3s ease-in-out, top 0.3s ease-in-out, transform 0.2s ease, background-color 0.2s ease-in-out';
        tokenRef.current.style.left = `calc(${player.position.x}% - 2.25rem)`;
        tokenRef.current.style.top = `calc(${player.position.y}% - 2.25rem)`;
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
        'absolute w-[4.5rem] h-[4.5rem] rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center text-center p-1 shadow-lg cursor-grab select-none',
        'hover:bg-primary/80',
        isDragged && 'cursor-grabbing shadow-2xl scale-110 z-10'
      )}
      style={{
        left: `calc(${player.position.x}% - 2.25rem)`,
        top: `calc(${player.position.y}% - 2.25rem)`,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      title={player.name}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <span className="text-xs font-bold leading-tight w-full px-1 whitespace-nowrap overflow-hidden text-ellipsis">{player.name}</span>
      <span className="text-[0.6rem] font-medium leading-tight opacity-80 w-full px-1">{player.positionName}</span>
    </div>
  );
}

    