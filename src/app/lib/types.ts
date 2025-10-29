export interface Player {
  id: string;
  name: string;
  position: { x: number; y: number }; // Percentage-based position
}

export interface Formation {
  name: string;
  players: Player[];
}
