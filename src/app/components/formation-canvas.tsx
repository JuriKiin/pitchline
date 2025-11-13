'use client';

import { DragEvent, useRef, useState } from 'react';
import type { Player } from '@/app/lib/types';
import PlayerToken from './player-token';

interface FormationCanvasProps {
  players: Player[];
  onPlayerPositionChange: (id: string, position: { x: number; y: number }) => void;
  onPlayerDrop: (e: DragEvent, targetPlayerId: string) => void;
}

export default function FormationCanvas({ players, onPlayerPositionChange, onPlayerDrop }: FormationCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedPlayerId, setDraggedPlayerId] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedPlayerId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tokenHalfWidth = 32; // Corresponds to w-16 -> 4rem -> 64px, half is 32px
    const clampedX = Math.max(tokenHalfWidth, Math.min(x, rect.width - tokenHalfWidth));
    const clampedY = Math.max(tokenHalfWidth, Math.min(y, rect.height - tokenHalfWidth));
    
    const newXPercent = (clampedX / rect.width) * 100;
    const newYPercent = (clampedY / rect.height) * 100;

    onPlayerPositionChange(draggedPlayerId, { x: newXPercent, y: newYPercent });
  };

  const handleMouseUp = () => {
    setDraggedPlayerId(null);
  };
  
  const handleMouseDownOnToken = (e: React.MouseEvent<HTMLDivElement>, player: Player) => {
    e.preventDefault();
    setDraggedPlayerId(player.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    // This drop is on the canvas, not a token. It implies moving a player.
    const playerId = e.dataTransfer.getData("playerId");
    if (!playerId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newXPercent = (x / rect.width) * 100;
    const newYPercent = (y / rect.height) * 100;
    
    onPlayerPositionChange(playerId, { x: newXPercent, y: newYPercent });
  };

  return (
    <div className="relative w-full h-full bg-accent/30 dark:bg-accent/20 rounded-lg border-2 border-dashed border-accent/50 overflow-hidden"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Field Markings */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/30 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[15%] aspect-square border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-[18%] border-2 border-white/30 border-t-0 rounded-b-xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-[18%] border-2 border-white/30 border-b-0 rounded-t-xl" />
      
      {players.map(player => (
        <PlayerToken
          key={player.id}
          player={player}
          onMouseDown={handleMouseDownOnToken}
          isDragged={draggedPlayerId === player.id}
          onDrop={(e) => onPlayerDrop(e, player.id)}
        />
      ))}
    </div>
  );
}
    