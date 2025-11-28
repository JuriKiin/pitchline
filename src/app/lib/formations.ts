import type { Player } from './types';

export interface Formation {
  name: string;
  players: Omit<Player, 'id' | 'name'>[];
}

export const formations11: Formation[] = [
  {
    name: '4-4-2',
    players: [
      { positionName: 'GK', position: { x: 50, y: 7 }, isBenched: false },
      { positionName: 'RB', position: { x: 85, y: 25 }, isBenched: false },
      { positionName: 'CB', position: { x: 65, y: 15 }, isBenched: false },
      { positionName: 'CB', position: { x: 35, y: 15 }, isBenched: false },
      { positionName: 'LB', position: { x: 15, y: 25 }, isBenched: false },
      { positionName: 'RM', position: { x: 80, y: 50 }, isBenched: false },
      { positionName: 'CM', position: { x: 60, y: 50 }, isBenched: false },
      { positionName: 'CM', position: { x: 40, y: 50 }, isBenched: false },
      { positionName: 'LM', position: { x: 20, y: 50 }, isBenched: false },
      { positionName: 'ST', position: { x: 60, y: 80 }, isBenched: false },
      { positionName: 'ST', position: { x: 40, y: 80 }, isBenched: false },
    ],
  },
  {
    name: '4-3-3',
    players: [
      { positionName: 'GK', position: { x: 50, y: 7 }, isBenched: false },
      { positionName: 'RB', position: { x: 85, y: 25 }, isBenched: false },
      { positionName: 'CB', position: { x: 65, y: 15 }, isBenched: false },
      { positionName: 'CB', position: { x: 35, y: 15 }, isBenched: false },
      { positionName: 'LB', position: { x: 15, y: 25 }, isBenched: false },
      { positionName: 'CDM', position: { x: 50, y: 40 }, isBenched: false },
      { positionName: 'CM', position: { x: 70, y: 55 }, isBenched: false },
      { positionName: 'CM', position: { x: 30, y: 55 }, isBenched: false },
      { positionName: 'RW', position: { x: 85, y: 75 }, isBenched: false },
      { positionName: 'ST', position: { x: 50, y: 85 }, isBenched: false },
      { positionName: 'LW', position: { x: 15, y: 75 }, isBenched: false },
    ],
  },
  {
    name: '3-5-2',
    players: [
      { positionName: 'GK', position: { x: 50, y: 7 }, isBenched: false },
      { positionName: 'CB', position: { x: 70, y: 20 }, isBenched: false },
      { positionName: 'CB', position: { x: 50, y: 15 }, isBenched: false },
      { positionName: 'CB', position: { x: 30, y: 20 }, isBenched: false },
      { positionName: 'RM', position: { x: 90, y: 50 }, isBenched: false },
      { positionName: 'CM', position: { x: 70, y: 45 }, isBenched: false },
      { positionName: 'CDM', position: { x: 50, y: 35 }, isBenched: false },
      { positionName: 'CM', position: { x: 30, y: 45 }, isBenched: false },
      { positionName: 'LM', position: { x: 10, y: 50 }, isBenched: false },
      { positionName: 'ST', position: { x: 60, y: 80 }, isBenched: false },
      { positionName: 'ST', position: { x: 40, y: 80 }, isBenched: false },
    ],
  },
  {
    name: '5-3-2',
    players: [
        { positionName: 'GK', position: { x: 50, y: 7 }, isBenched: false },
        { positionName: 'RWB', position: { x: 90, y: 35 }, isBenched: false },
        { positionName: 'CB', position: { x: 70, y: 20 }, isBenched: false },
        { positionName: 'CB', position: { x: 50, y: 15 }, isBenched: false },
        { positionName: 'CB', position: { x: 30, y: 20 }, isBenched: false },
        { positionName: 'LWB', position: { x: 10, y: 35 }, isBenched: false },
        { positionName: 'CM', position: { x: 70, y: 55 }, isBenched: false },
        { positionName: 'CM', position: { x: 50, y: 50 }, isBenched: false },
        { positionName: 'CM', position: { x: 30, y: 55 }, isBenched: false },
        { positionName: 'ST', position: { x: 60, y: 80 }, isBenched: false },
        { positionName: 'ST', position: { x: 40, y: 80 }, isBenched: false },
    ],
  },
];

export const formations7: Formation[] = [
  {
    name: '2-3-1',
    players: [
      { positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
      { positionName: 'DEF', position: { x: 75, y: 30 }, isBenched: false },
      { positionName: 'DEF', position: { x: 25, y: 30 }, isBenched: false },
      { positionName: 'MID', position: { x: 80, y: 60 }, isBenched: false },
      { positionName: 'MID', position: { x: 50, y: 50 }, isBenched: false },
      { positionName: 'MID', position: { x: 20, y: 60 }, isBenched: false },
      { positionName: 'FWD', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '3-2-1',
    players: [
      { positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
      { positionName: 'DEF', position: { x: 80, y: 25 }, isBenched: false },
      { positionName: 'DEF', position: { x: 50, y: 25 }, isBenched: false },
      { positionName: 'DEF', position: { x: 20, y: 25 }, isBenched: false },
      { positionName: 'MID', position: { x: 65, y: 55 }, isBenched: false },
      { positionName: 'MID', position: { x: 35, y: 55 }, isBenched: false },
      { positionName: 'FWD', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '1-3-2',
    players: [
      { positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
      { positionName: 'DEF', position: { x: 50, y: 30 }, isBenched: false },
      { positionName: 'MID', position: { x: 80, y: 55 }, isBenched: false },
      { positionName: 'MID', position: { x: 50, y: 50 }, isBenched: false },
      { positionName: 'MID', position: { x: 20, y: 55 }, isBenched: false },
      { positionName: 'FWD', position: { x: 65, y: 85 }, isBenched: false },
      { positionName: 'FWD', position: { x: 35, y: 85 }, isBenched: false },
    ],
  },
];

export const formations6: Formation[] = [
  {
    name: '2-2-1',
    players: [
      { positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
      { positionName: 'DEF', position: { x: 70, y: 35 }, isBenched: false },
      { positionName: 'DEF', position: { x: 30, y: 35 }, isBenched: false },
      { positionName: 'MID', position: { x: 75, y: 65 }, isBenched: false },
      { positionName: 'MID', position: { x: 25, y: 65 }, isBenched: false },
      { positionName: 'FWD', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '1-3-1',
    players: [
      { positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
      { positionName: 'DEF', position: { x: 50, y: 30 }, isBenched: false },
      { positionName: 'MID', position: { x: 80, y: 55 }, isBenched: false },
      { positionName: 'MID', position: { x: 50, y: 50 }, isBenched: false },
      { positionName: 'MID', position: { x: 20, y: 55 }, isBenched: false },
      { positionName: 'FWD', position: { x: 50, y: 85 }, isBenched: false },
    ],
  },
  {
    name: '2-1-2',
    players: [
      { positionName: 'GK', position: { x: 50, y: 10 }, isBenched: false },
      { positionName: 'DEF', position: { x: 70, y: 30 }, isBenched: false },
      { positionName: 'DEF', position: { x: 30, y: 30 }, isBenched: false },
      { positionName: 'MID', position: { x: 50, y: 55 }, isBenched: false },
      { positionName: 'FWD', position: { x: 75, y: 80 }, isBenched: false },
      { positionName: 'FWD', position: { x: 25, y: 80 }, isBenched: false },
    ],
  },
];
