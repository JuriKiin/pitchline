'use client';

import { DragEvent } from 'react';
import type { Player } from '@/app/lib/types';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface PlayerTokenProps {
  player: Player;
  onMouseDown: () => void;
  onTouchStart: () => void;
  isDragged: boolean;
  onDrop: (e: DragEvent) => void;
}

export default function PlayerToken({ player, onMouseDown, onTouchStart, isDragged, onDrop }: PlayerTokenProps) {
  
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("playerId", player.id);
  };
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      key={player.id}
      className={cn(
        'absolute w-16 h-16 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center text-center p-1 shadow-lg cursor-grab select-none',
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
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <User className="w-5 h-5 mb-0.5" />
      <span className="text-xs font-medium leading-tight truncate w-full px-1">{player.name}</span>
    </div>
  );
}
