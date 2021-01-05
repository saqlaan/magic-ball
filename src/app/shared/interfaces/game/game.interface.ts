export interface Game {

  _id: string;
  groupName: number;
  timePerRound: number;
  archWizard: string;
  noOfRounds: number;
  ballsPerRound: number;
  totalScore: number;
  maxPlayers: string;
  players: any [];
  access_toolbox: boolean;
  save_metrics: boolean;
  currentRound: number;
  hostId: string;
  gameCode: string;
  rounds: any [];

}
