import type { Player } from './types';

// Default 11-player formation (e.g., 4-3-3)
export const initialPlayers11: Player[] = [
  { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 } },
  { id: 'p2', name: 'Right Back', position: { x: 85, y: 25 } },
  { id: 'p3', name: 'Center Back', position: { x: 65, y: 15 } },
  { id: 'p4', name: 'Center Back', position: { x: 35, y: 15 } },
  { id: 'p5', name: 'Left Back', position: { x: 15, y: 25 } },
  { id: 'p6', name: 'Def. Mid', position: { x: 50, y: 40 } },
  { id: 'p7', name: 'Center Mid', position: { x: 70, y: 55 } },
  { id: 'p8', name: 'Center Mid', position: { x: 30, y: 55 } },
  { id: 'p9', name: 'Right Winger', position: { x: 85, y: 75 } },
  { id: 'p10', name: 'Striker', position: { x: 50, y: 85 } },
  { id: 'p11', name: 'Left Winger', position: { x: 15, y: 75 } },
];

// Default 7-player formation (e.g., 2-3-1)
export const initialPlayers7: Player[] = [
  { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
  { id: 'p2', name: 'Defender', position: { x: 75, y: 30 } },
  { id: 'p3', name: 'Defender', position: { x: 25, y: 30 } },
  { id: 'p4', name: 'Midfielder', position: { x: 80, y: 60 } },
  { id: 'p5', name: 'Midfielder', position: { x: 50, y: 50 } },
  { id: 'p6', name: 'Midfielder', position: { x: 20, y: 60 } },
  { id: 'p7', name: 'Forward', position: { x: 50, y: 85 } },
];

// Default 6-player formation (e.g., 2-2-1)
export const initialPlayers6: Player[] = [
  { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
  { id: 'p2', name: 'Defender', position: { x: 70, y: 35 } },
  { id: 'p3', name: 'Defender', position: { x: 30, y: 35 } },
  { id: 'p4', name: 'Midfielder', position: { x: 75, y: 65 } },
  { id: 'p5', name: 'Midfielder', position: { x: 25, y: 65 } },
  { id: 'p6', name: 'Forward', position: { x: 50, y: 85 } },
];
