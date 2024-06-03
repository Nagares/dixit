import { PlayerAction } from "./actions/PlayerAction";

export interface Player {
    playerId: string;
    name: string;
    points: number;
    playerActions: PlayerAction[];
    messages: string[];
}