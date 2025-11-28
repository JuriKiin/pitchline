export interface Player {
  id: string;
  name: string;
  positionName: string;
  position: { x: number; y: number }; // Percentage-based position
  isBenched: boolean;
}

export interface Formation {
  name: string;
  players: Omit<Player, 'id' | 'name'>[];
}
