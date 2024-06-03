import { GameState } from "../types/GameState";
import { ImageSubmission } from "./ImageSubmission";
import { Player } from "./Player";

export interface ServerState {
    maxPlayers: number;
    maxRound: number;
    players: Player[];
    currentGameState: GameState;
    currentRound: number;
    currentText: string;
    currentPlayerToWriteText: Player;
    currentImageSubmissions: ImageSubmission[];
    currentVotesSubmissions: Player[];
}