export interface Game {
  players: any [];
  _id: string;
  groupName: number;
  groupSize: number;
  rounds: number;
  balls: number;
  timePerRound: number;
  status: boolean;
  gameCode: string;
}
