
import type { Player } from './types';

export interface Formation {
  name: string;
  players: Player[];
}

export const formations11: Formation[] = [
  {
    name: '4-4-2',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 }, isBenched: false },
      { id: 'p2', name: 'Right Back', position: { x: 85, y: 25 }, isBenched: false },
      { id: 'p3', name: 'Center Back', position: { x: 65, y: 15 }, isBenched: false },
      { id: 'p4', name: 'Center Back', position: { x: 35, y: 15 }, isBenched: false },
      { id: 'p5', name: 'Left Back', position: { x: 15, y: 25 }, isBenched: false },
      { id: 'p6', name: 'Right Mid', position: { x: 80, y: 50 }, isBenched: false },
      { id: 'p7', name: 'Center Mid', position: { x: 60, y: 50 }, isBenched: false },
      { id: 'p8', name: 'Center Mid', position: { x: 40, y: 50 }, isBenched: false },
      { id: 'p9', name: 'Left Mid', position: { x: 20, y: 50 }, isBenched: false },
      { id: 'p10', name: 'Striker', position: { x: 60, y: 80 }, isBenched: false },
      { id: 'p11', name: 'Striker', position: { x: 40, y: 80 }, isBenched: false },
    ],
  },
  {
    name: '4-3-3',
    players: [
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
    ],
  },
  {
    name: '3-5-2',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 }, isBenched: false },
      { id: 'p2', name: 'Center Back', position: { x: 70, y: 20 }, isBenched: false },
      { id: 'p3', name: 'Center Back', position: { x: 50, y: 15 }, isBenched: false },
      { id: 'p4', name: 'Center Back', position: { x: 30, y: 20 }, isBenched: false },
      { id: 'p5', name: 'Right Mid', position: { x: 90, y: 50 }, isBenched: false },
      { id: 'p6', name: 'Center Mid', position: { x: 70, y: 45 }, isBenched: false },
      { id: 'p7', name: 'Def. Mid', position: { x: 50, y: 35 }, isBenched: false },
      { id: 'p8', name: 'Center Mid', position: { x: 30, y: 45 }, isBenched: false },
      { id: 'p9', name: 'Left Mid', position: { x: 10, y: 50 }, isBenched: false },
      { id: 'p10', name: 'Striker', position: { x: 60, y: 80 }, isBenched: false },
      { id: 'p11', name: 'Striker', position: { x: 40, y: 80 }, isBenched: false },
    ],
  },
  {
    name: '5-3-2',
    players: [
        { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 }, isBenched: false },
        { id: 'p2', name: 'Right Wing-Back', position: { x: 90, y: 35 }, isBenched: false },
        { id: 'p3', name: 'Center Back', position: { x: 70, y: 20 }, isBenched: false },
        { id: 'p4', name: 'Center Back', position: { x: 50, y: 15 }, isBenched: false },
        { id: 'p5', name: 'Center Back', position: { x: 30, y: 20 }, isBenched: false },
        { id: 'p6', name: 'Left Wing-Back', position: { x: 10, y: 35 }, isBenched: false },
        { id: 'p7', name: 'Center Mid', position: { x: 70, y: 55 }, isBenched: false },
        { id: 'p8', name: 'Center Mid', position: { x: 50, y: 50 }, isBenched: false },
        { id: 'p9', name: 'Center Mid', position: { x: 30, y: 55 }, isBenched: false },
        { id: 'p10', name: 'Striker', position: { x: 60, y: 80 }, isBenched: false },
        { id: 'p11', name: 'Striker', position: { x: 40, y: 80 }, isBenched: false },
    ],
  },
];

export const formations7: Formation[] = [
  {
    name: '2-3-1',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
      { id: 'p2', name: 'Defender', position: { x: 75, y: 30 }, isBenched: false },
      { id: 'p3', name: 'Defender', position: { x: 25, y: 30 }, isBenched: false },
      { id: 'p4', name: 'Midfielder', position: { x: 80, y: 60 }, isBenched: false },
      { id: 'p5', name: 'Midfielder', position: { x: 50, y: 50 }, isBenched: false },
      { id: 'p6', name: 'Midfielder', position: { x: 20, y: 60 }, isBenched: false },
      { id: 'p7', name: 'Forward', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '3-2-1',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
      { id: 'p2', name: 'Defender', position: { x: 80, y: 25 }, isBenched: false },
      { id: 'p3', name: 'Defender', position: { x: 50, y: 25 }, isBenched: false },
      { id: 'p4', name: 'Defender', position: { x: 20, y: 25 }, isBenched: false },
      { id: 'p5', name: 'Midfielder', position: { x: 65, y: 55 }, isBenched: false },
      { id: 'p6', name: 'Midfielder', position: { x: 35, y: 55 }, isBenched: false },
      { id: 'p7', name: 'Forward', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '1-3-2',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
      { id: 'p2', name: 'Defender', position: { x: 50, y: 30 }, isBenched: false },
      { id: 'p3', name: 'Midfielder', position: { x: 80, y: 55 }, isBenched: false },
      { id: 'p4', name: 'Midfielder', position: { x: 50, y: 50 }, isBenched: false },
      { id: 'p5', name: 'Midfielder', position: { x: 20, y: 55 }, isBenched: false },
      { id: 'p6', name: 'Forward', position: { x: 65, y: 85 }, isBenched: false },
      { id: 'p7', name: 'Forward', position: { x: 35, y: 85 }, isBenched: false },
    ],
  },
];

export const formations6: Formation[] = [
  {
    name: '2-2-1',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
      { id: 'p2', name: 'Defender', position: { x: 70, y: 35 }, isBenched: false },
      { id: 'p3', name: 'Defender', position: { x: 30, y: 35 }, isBenched: false },
      { id: 'p4', name: 'Midfielder', position: { x: 75, y: 65 }, isBenched: false },
      { id: 'p5', name: 'Midfielder', position: { x: 25, y: 65 }, isBenched: false },
      { id: 'p6', name: 'Forward', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '1-3-1',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
      { id: 'p2', name: 'Defender', position: { x: 50, y: 30 }, isBenched: false },
      { id: 'p3', name: 'Midfielder', position: { x: 80, y: 55 }, isBenched: false },
      { id: 'p4', name: 'Midfielder', position: { x: 50, y: 50 }, isBenched: false },
      { id: 'p5', name: 'Midfielder', position: { x: 20, y: 55 }, isBenched: false },
      { id: 'p6', name: 'Forward', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '2-1-2',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 }, isBenched: false },
      { id: 'p2', name: 'Defender', position: { x: 70, y: 30 }, isBenched: false },
      { id: 'p3', name: 'Defender', position: { x: 30, y: 30 }, isBenched: false },
      { id: 'p4', name: 'Midfielder', position: { x: 50, y: 55 }, isBenched: false },
      { id: 'p5', name: 'Forward', position: { x: 75, y: 80 }, isBenched: false },
      { id: 'p6', name: 'Forward', position: { x: 25, y: 80 }, isBenched: false },
    ],
  },
];

    