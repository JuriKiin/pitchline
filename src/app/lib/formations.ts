import type { Player } from './types';

export interface Formation {
  name: string;
  players: Player[];
}

export const formations11: Formation[] = [
  {
    name: '4-4-2',
    players: [
      { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 } },
      { id: 'p2', name: 'Right Back', position: { x: 85, y: 25 } },
      { id: 'p3', name: 'Center Back', position: { x: 65, y: 15 } },
      { id: 'p4', name: 'Center Back', position: { x: 35, y: 15 } },
      { id: 'p5', name: 'Left Back', position: { x: 15, y: 25 } },
      { id: 'p6', name: 'Right Mid', position: { x: 80, y: 50 } },
      { id: 'p7', name: 'Center Mid', position: { x: 60, y: 50 } },
      { id: 'p8', name: 'Center Mid', position: { x: 40, y: 50 } },
      { id: 'p9', name: 'Left Mid', position: { x: 20, y: 50 } },
      { id: 'p10', name: 'Striker', position: { x: 60, y: 80 } },
      { id: 'p11', name: 'Striker', position: { x: 40, y: 80 } },
    ],
  },
  {
    name: '4-3-3',
    players: [
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
    ],
  },
  {
    name: '3-5-2',
    players: [
        { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 7 } },
        { id: 'p2', name: 'Center Back', position: { x: 70, y: 20 } },
        { id: 'p3', name: 'Center Back', position: { x: 50, y: 15 } },
        { id: 'p4', name: 'Center Back', position: { x: 30, y: 20 } },
        { id: 'p5', name: 'Right Mid', position: { x: 90, y: 50 } },
        { id: 'p6', name: 'Center Mid', position: { x: 65, y: 45 } },
        { id: 'p7', name: 'Def. Mid', position: { x: 50, y: 35 } },
        { id: 'p8', name: 'Center Mid', position: { x: 35, y: 45 } },
        { id: 'p9', name: 'Left Mid', position: { x: 10, y: 50 } },
        { id: 'p10', name: 'Striker', position: { x: 60, y: 80 } },
        { id: 'p11', name: 'Striker', position: { x: 40, y: 80 } },
    ],
  },
];

export const formations7: Formation[] = [
    {
        name: '2-3-1',
        players: [
            { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
            { id: 'p2', name: 'Defender', position: { x: 75, y: 30 } },
            { id: 'p3', name: 'Defender', position: { x: 25, y: 30 } },
            { id: 'p4', name: 'Midfielder', position: { x: 80, y: 60 } },
            { id: 'p5', name: 'Midfielder', position: { x: 50, y: 50 } },
            { id: 'p6', name: 'Midfielder', position: { x: 20, y: 60 } },
            { id: 'p7', name: 'Forward', position: { x: 50, y: 85 } },
        ],
    },
    {
        name: '3-2-1',
        players: [
            { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
            { id: 'p2', name: 'Defender', position: { x: 80, y: 35 } },
            { id: 'p3', name: 'Defender', position: { x: 50, y: 25 } },
            { id: 'p4', name: 'Defender', position: { x: 20, y: 35 } },
            { id: 'p5', name: 'Midfielder', position: { x: 65, y: 60 } },
            { id: 'p6', name: 'Midfielder', position: { x: 35, y: 60 } },
            { id: 'p7', name: 'Forward', position: { x: 50, y: 85 } },
        ],
    },
     {
        name: '1-3-2',
        players: [
            { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
            { id: 'p2', name: 'Defender', position: { x: 50, y: 30 } },
            { id: 'p3', name: 'Midfielder', position: { x: 80, y: 55 } },
            { id: 'p4', name: 'Midfielder', position: { x: 50, y: 50 } },
            { id: 'p5', name: 'Midfielder', position: { x: 20, y: 55 } },
            { id: 'p6', name: 'Forward', position: { x: 65, y: 80 } },
            { id: 'p7', name: 'Forward', position: { x: 35, y: 80 } },
        ],
    }
];

export const formations6: Formation[] = [
    {
        name: '2-2-1',
        players: [
            { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
            { id: 'p2', name: 'Defender', position: { x: 70, y: 35 } },
            { id: 'p3', name: 'Defender', position: { x: 30, y: 35 } },
            { id: 'p4', name: 'Midfielder', position: { x: 75, y: 65 } },
            { id: 'p5', name: 'Midfielder', position: { x: 25, y: 65 } },
            { id: 'p6', name: 'Forward', position: { x: 50, y: 85 } },
        ],
    },
    {
        name: '2-1-2',
        players: [
            { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
            { id: 'p2', name: 'Defender', position: { x: 70, y: 30 } },
            { id: 'p3', name: 'Defender', position: { x: 30, y: 30 } },
            { id: 'p4', name: 'Midfielder', position: { x: 50, y: 55 } },
            { id: 'p5', name: 'Forward', position: { x: 70, y: 80 } },
            { id: 'p6', name: 'Forward', position: { x: 30, y: 80 } },
        ],
    },
     {
        name: '1-3-1',
        players: [
            { id: 'p1', name: 'Goalkeeper', position: { x: 50, y: 10 } },
            { id: 'p2', name: 'Defender', position: { x: 50, y: 30 } },
            { id: 'p3', name: 'Midfielder', position: { x: 80, y: 55 } },
            { id: 'p4', name: 'Midfielder', position: { x: 50, y: 50 } },
            { id: 'p5', name: 'Midfielder', position: { x: 20, y: 55 } },
            { id: 'p6', name: 'Forward', position: { x: 50, y: 85 } },
        ],
    }
];
