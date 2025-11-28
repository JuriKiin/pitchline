'use client';

import { DragEvent, useRef, useState, TouchEvent } from 'react';
import type { Player } from '@/app/lib/types';
import PlayerToken from './player-token';

interface FormationCanvasProps {
  players: Player[];
  previousPlayers: Player[];
  onPlayerPositionChange: (id: string, position: { x: number; y: number }) => void;
  onPlayerDrop: (e: DragEvent, targetPlayerId?: string) => void;
  onTouchDrop: (e: TouchEvent, targetPlayerId?: string) => void;
  onTouchStart: (player: Player) => void;
  draggedPlayer: Player | null;
}

export default function FormationCanvas({ 
  players, 
  previousPlayers, 
  onPlayerPositionChange, 
  onPlayerDrop,
  onTouchDrop,
  onTouchStart,
  draggedPlayer
}: FormationCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedPlayer || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tokenHalfWidth = 32;
    const clampedX = Math.max(tokenHalfWidth, Math.min(x, rect.width - tokenHalfWidth));
    const clampedY = Math.max(tokenHalfWidth, Math.min(y, rect.height - tokenHalfWidth));
    
    const newXPercent = (clampedX / rect.width) * 100;
    const newYPercent = (clampedY / rect.height) * 100;

    onPlayerPositionChange(draggedPlayer.id, { x: newXPercent, y: newYPercent });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!draggedPlayer || !canvasRef.current) return;
    const touch = e.touches[0];
    if (touch) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const tokenHalfWidth = 32;
      const clampedX = Math.max(tokenHalfWidth, Math.min(x, rect.width - tokenHalfWidth));
      const clampedY = Math.max(tokenHalfWidth, Math.min(y, rect.height - tokenHalfWidth));

      const newXPercent = (clampedX / rect.width) * 100;
      const newYPercent = (clampedY / rect.height) * 100;

      onPlayerPositionChange(draggedPlayer.id, { x: newXPercent, y: newYPercent });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="relative w-full h-full bg-accent/30 dark:bg-accent/20 rounded-lg border-2 border-dashed border-accent/50 overflow-hidden touch-none"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => onTouchStart(null!)}
      onMouseLeave={() => onTouchStart(null!)}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => onTouchDrop(e)}
      onDragOver={handleDragOver}
      onDrop={onPlayerDrop}
      data-canvas-dropzone="true"
    >
      {/* Field Markings */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/30 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[15%] aspect-square border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-[18%] border-2 border-white/30 border-t-0 rounded-b-xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-[18%] border-2 border-white/30 border-b-0 rounded-t-xl pointer-events-none" />
      
      {players.map(player => {
        const previousPlayer = previousPlayers.find(p => p.id === player.id);
        const oldPosition = previousPlayer ? previousPlayer.position : player.position;

        return (
          <PlayerToken
            key={player.id}
            player={player}
            oldPosition={oldPosition}
            onMouseDown={() => onTouchStart(player)}
            onTouchStart={() => onTouchStart(player)}
            isDragged={draggedPlayer?.id === player.id}
            onDrop={(e) => onPlayerDrop(e, player.id)}
            onTouchEnd={(e) => onTouchDrop(e, player.id)}
          />
        )
      })}
    </div>
  );
}
    