'use client';

import * as React from 'react';
import { DragEvent, TouchEvent } from 'react';
import type { Player } from '@/app/lib/types';
import { cn } from '@/lib/utils';

interface PlayerTokenProps {
  player: Player;
  onMouseDown: () => void;
  onTouchStart: () => void;
  isDragged: boolean;
  onDrop: (e: DragEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  playerColor: string;
}

export default function PlayerToken({ 
  player, 
  onMouseDown, 
  onTouchStart, 
  isDragged, 
  onDrop, 
  onTouchEnd,
  playerColor 
}: PlayerTokenProps) {
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("playerId", player.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      key={player.id}
      data-player-id={player.id}
      className={cn(
        'absolute w-[4.25rem] h-[4.25rem] rounded-full flex flex-col items-center justify-center text-center p-1 shadow-lg cursor-grab select-none text-primary-foreground',
        'transition-[left,top,transform,background-color] duration-300 ease-in-out',
        'hover:scale-105',
        isDragged && 'cursor-grabbing shadow-2xl scale-110 z-10'
      )}
      style={{
        left: `calc(${player.position.x}% - 2.125rem)`,
        top: `calc(${player.position.y}% - 2.125rem)`,
        backgroundColor: playerColor,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      title={player.name}
      draggable
      onDragStart={handleDragStart}
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <span className="text-xs font-bold leading-tight w-full px-1" style={{ overflowWrap: 'break-word' }}>{player.name}</span>
      <span className="text-[0.6rem] font-medium leading-tight opacity-80 w-full px-1">{player.positionName}</span>
    </div>
  );
}
