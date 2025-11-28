'use client';

import { DragEvent, useRef, useState, TouchEvent } from 'react';
import type { Player } from '@/app/lib/types';
import PlayerToken from './player-token';

interface FormationCanvasProps {
  players: Player[];
  previousPlayers: Player[];
  onPlayerPositionChange: (id: string, position: { x: number; y: number }) => void;
  onPlayerDrop: (e: DragEvent, targetPlayerId?: string) => void;
}

export default function FormationCanvas({ players, previousPlayers, onPlayerPositionChange, onPlayerDrop }: FormationCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);

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

  const handleMouseUp = () => {
    setDraggedPlayer(null);
  };

  const handleTouchEnd = () => {
    setDraggedPlayer(null);
  };
  
  const handleMouseDown = (player: Player) => {
    setDraggedPlayer(player);
  };

  const handleTouchStart = (player: Player) => {
    setDraggedPlayer(player);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedPlayerId = e.dataTransfer.getData('playerId');
    if (!draggedPlayerId) return;

    // Check if dropping on the canvas itself (not a player token)
    if ((e.target as HTMLElement).hasAttribute('data-canvas-dropzone')) {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newXPercent = (x / rect.width) * 100;
      const newYPercent = (y / rect.height) * 100;
      
      onPlayerPositionChange(draggedPlayerId, { x: newXPercent, y: newYPercent });
    } else {
        // This case is handled by onPlayerDrop in PlayerToken for swaps,
        // but we still call the main drop handler to consolidate logic if needed.
        onPlayerDrop(e);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-accent/30 dark:bg-accent/20 rounded-lg border-2 border-dashed border-accent/50 overflow-hidden touch-none"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
            onMouseDown={() => handleMouseDown(player)}
            onTouchStart={() => handleTouchStart(player)}
            isDragged={draggedPlayer?.id === player.id}
            onDrop={(e) => onPlayerDrop(e, player.id)}
          />
        )
      })}
    </div>
  );
}
    