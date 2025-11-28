'use client';

import { DragEvent } from 'react';
import type { Player } from '@/app/lib/types';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface PlayerTokenProps {
  player: Player;
  onInteractionStart: (player: Player) => void;
  isDragged: boolean;
  onDrop: (e: DragEvent) => void;
  isSwapTarget: boolean;
  isSwapSource: boolean;
}

export default function PlayerToken({ player, onInteractionStart, isDragged, onDrop, isSwapTarget, isSwapSource }: PlayerTokenProps) {
  
  const handleDragStart = (e: DragEvent) => {
    // Only allow drag for non-touch devices to avoid conflicts
    if (e.pointerType !== 'touch') {
      e.dataTransfer.setData("playerId", player.id);
    }
  };
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onInteractionStart(player);
  };

  return (
    <div
      key={player.id}
      className={cn(
        'absolute w-16 h-16 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center text-center p-1 shadow-lg select-none transition-all duration-200 ease-in-out',
        isDragged ? 'cursor-grabbing shadow-2xl scale-110 z-10' : 'cursor-grab',
        isSwapSource && 'ring-4 ring-primary ring-offset-2 ring-offset-background',
        isSwapTarget && 'cursor-pointer ring-2 ring-dashed ring-primary/70 animate-pulse',
        !isSwapSource && !isSwapTarget && 'cursor-grab'
      )}
      style={{
        left: `calc(${player.position.x}% - 2rem)`,
        top: `calc(${player.position.y}% - 2rem)`,
      }}
      onMouseDown={handleClick}
      onTouchStart={handleClick}
      title={player.name}
      draggable={!isSwapSource && !isSwapTarget}
      onDragStart={handleDragStart}
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <User className="w-5 h-5 mb-0.5" />
      <span className="text-xs font-medium leading-tight truncate w-full px-1">{player.name}</span>
    </div>
  );
}
