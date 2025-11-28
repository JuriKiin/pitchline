import type { Player } from './types';

// Default 11-player formation (e.g., 4-3-3)
export const initialPlayers11: Player[] = [
  { id: 'p1', name: 'Player 1', positionName: 'GK', position: { x: 50, y: 7 }, isBenched: false },
  { id: 'p2', name: 'Player 2', positionName: 'RB', position: { x: 85, y: 25 }, isBenched: false },
  { id: 'p3', name: 'Player 3', positionName: 'CB', position: { x: 65, y: 15 }, isBenched: false },
  { id: 'p4', name: 'Player 4', positionName: 'CB', position: { x: 35, y: 15 }, isBenched: false },
  { id: 'p5', name: 'Player 5', positionName: 'LB', position: { x: 15, y: 25 }, isBenched: false },
  { id: 'p6', name: 'Player 6', positionName: 'CDM', position: { x: 50, y: 40 }, isBenched: false },
  { id: 'p7', name: 'Player 7', positionName: 'CM', position: { x: 70, y: 55 }, isBenched: false },
  { id: 'p8', name: 'Player 8', positionName: 'CM', position: { x: 30, y: 55 }, isBenched: false },
  { id: 'p9', name: 'Player 9', positionName: 'RW', position: { x: 85, y: 75 }, isBenched: false },
  { id: 'p10', name: 'Player 10', positionName: 'ST', position: { x: 50, y: 85 }, isBenched: false },
  { id: 'p11', name: 'Player 11', positionName: 'LW', position: { x: 15, y: 75 }, isBenched: false },
  { id: 's1', name: 'Sub 1', positionName: 'SUB', position: { x: 0, y: 0 }, isBenched: true },
  { id: 's2', name: 'Sub 2', positionName: 'SUB', position: { x: 0, y: 0 }, isBenched: true },
  { id: 's3', name: 'Sub 3', positionName: 'SUB', position: { x: 0, y: 0 }, isBenched: true },
];

// Default 7-player formation (e.g., 2-3-1)
export const initialPlayers7: Player[] = [
  { id: 'p1', name: 'Player 1', positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
  { id: 'p2', name: 'Player 2', positionName: 'CB', position: { x: 75, y: 30 }, isBenched: false },
  { id: 'p3', name: 'Player 3', positionName: 'CB', position: { x: 25, y: 30 }, isBenched: false },
  { id: 'p4', name: 'Player 4', positionName: 'RM', position: { x: 80, y: 60 }, isBenched: false },
  { id: 'p5', name: 'Player 5', positionName: 'CM', position: { x: 50, y: 50 }, isBenched: false },
  { id: 'p6', name: 'Player 6', positionName: 'LM', position: { x: 20, y: 60 }, isBenched: false },
  { id: 'p7', name: 'Player 7', positionName: 'ST', position: { x: 50, y: 85 }, isBenched: false },
  { id: 's1', name: 'Sub 1', positionName: 'SUB', position: { x: 0, y: 0 }, isBenched: true },
  { id: 's2', name: 'Sub 2', positionName: 'SUB', position: { x: 0, y: 0 }, isBenched: true },
];

// Default 6-player formation (e.g., 2-2-1)
export const initialPlayers6: Player[] = [
  { id: 'p1', name: 'Player 1', positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
  { id: 'p2', name: 'Player 2', positionName: 'CB', position: { x: 70, y: 35 }, isBenched: false },
  { id: 'p3', name: 'Player 3', positionName: 'CB', position: { x: 30, y: 35 }, isBenched: false },
  { id: 'p4', name: 'Player 4', positionName: 'CM', position: { x: 75, y: 65 }, isBenched: false },
  { id: 'p5', name: 'Player 5', positionName: 'CM', position: { x: 25, y: 65 }, isBenched: false },
  { id: 'p6', name: 'Player 6', positionName: 'ST', position: { x: 50, y: 85 }, isBenched: false },
  { id: 's1', name: 'Sub 1', positionName: 'SUB', position: { x: 0, y: 0 }, isBenched: true },
];
