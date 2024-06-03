import { Text, VStack } from "@chakra-ui/react";
import { Player } from "../models/Player";

type WaitingForPlayerViewProps = {
    currentPlayer: Player;
}

export const WaitingForPlayerView: React.FC<WaitingForPlayerViewProps> = ({ currentPlayer }: WaitingForPlayerViewProps) => {
    return (
        <VStack spacing={5}>
            <Text>Welcome {currentPlayer.name}</Text>
            <Text>Player id : {currentPlayer.playerId}</Text>
            <Text>Currently waiting for another player</Text>
        </VStack>
    );
};