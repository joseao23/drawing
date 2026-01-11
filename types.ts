
export interface Person {
  id: string;
  name: string;
  photoUrl: string;
}

export interface RouletteState {
  spinning: boolean;
  winner: Person | null;
  selectedIds: Set<string>;
}
