import type { Player } from './types';

// Default 11-player formation (e.g., 4-3-3)
export const initialPlayers11: Player[] = [
  { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 }, isBenched: false },
  { id: 'p2', name: 'Right Back', position: { x: 85, y: 25 }, isBenched: false },
  { id: 'p3', name: 'Center Back', position: { x: 65, y: 15 }, isBenched: false },
  { id: 'p4', name: 'Center Back', position: { x: 35, y: 15 }, isBenched: false },
  { id: 'p5', name: 'Left Back', position: { x: 15, y: 25 }, isBenched: false },
  { id: 'p6', name: 'Def. Mid', position: { x: 50, y: 40 }, isBenched: false },
  { id: 'p7', name: 'Center Mid', position: { x: 70, y: 55 }, isBenched: false },
  { id: 'p8', name: 'Center Mid', position: { x: 30, y: 55 }, isBenched: false },
  { id: 'p9', name: 'Right Winger', position: { x: 85, y: 75 }, isBenched: false },
  { id: 'p10', name: 'Striker', position: { x: 50, y: 85 }, isBenched: false },
  { id: 'p11', name: 'Left Winger', position: { x: 15, y: 75 }, isBenched: false },
  { id: 's1', name: 'Sub 1', position: { x: 0, y: 0 }, isBenched: true },
  { id: 's2', name: 'Sub 2', position: { x: 0, y: 0 }, isBenched: true },
  { id: 's3', name: 'Sub 3', position: { x: 0, y: 0 }, isBenched: true },
];

// Default 7-player formation (e.g., 2-3-1)
export const initialPlayers7: Player[] = [
  { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
  { id: 'p2', name: 'Defender', position: { x: 75, y: 30 }, isBenched: false },
  { id: 'p3', name: 'Defender', position: { x: 25, y: 30 }, isBenched: false },
  { id: 'p4', name: 'Midfielder', position: { x: 80, y: 60 }, isBenched: false },
  { id: 'p5', name: 'Midfielder', position: { x: 50, y: 50 }, isBenched: false },
  { id: 'p6', name: 'Midfielder', position: { x: 20, y: 60 }, isBenched: false },
  { id: 'p7', name: 'Forward', position: { x: 50, y: 85 }, isBenched: false },
  { id: 's1', name: 'Sub 1', position: { x: 0, y: 0 }, isBenched: true },
  { id: 's2', name: 'Sub 2', position: { x: 0, y: 0 }, isBenched: true },
];

// Default 6-player formation (e.g., 2-2-1)
export const initialPlayers6: Player[] = [
  { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
  { id: 'p2', name: 'Defender', position: { x: 70, y: 35 }, isBenched: false },
  { id: 'p3', name: 'Defender', position: { x: 30, y: 35 }, isBenched: false },
  { id: 'p4', name: 'Midfielder', position: { x: 75, y: 65 }, isBenched: false },
  { id: 'p5', name: 'Midfielder', position: { x: 25, y: 65 }, isBenched: false },
  { id: 'p6', name: 'Forward', position: { x: 50, y: 85 }, isBenched: false },
  { id: 's1', name: 'Sub 1', position: { x: 0, y: 0 }, isBenched: true },
];