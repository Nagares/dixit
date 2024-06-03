import { Box, Button, Text, VStack } from "@chakra-ui/react"
import { ServerState } from "../models/Serverstate";
import { getApiPlayerNextRoundUrl } from "../utils/UrlUtils";
import { Player } from "../models/Player";

type CurrentResultViewProps = {
    currentPlayer: Player;
    serverState: ServerState;
}

export const CurrentResultView: React.FC<CurrentResultViewProps> = ({ currentPlayer, serverState }: CurrentResultViewProps) => {

    const handleNextRound = () => {
        fetch(getApiPlayerNextRoundUrl(currentPlayer.playerId), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return (
        <Box>
            <Text>{`Current result for round : ${serverState.currentRound}`}</Text>
            <VStack mt={5}>
                {serverState?.players.map(p => {
                    return (
                        <Box key={p.playerId}>
                            <Text>{`Player: ${p.name} (points: ${p.points})`}</Text>
                        </Box>
                    )
                })}
            </VStack>
            <Button mt={10} colorScheme='blue' onClick={() => handleNextRound()}>Start next round</Button>
        </Box>
    )
}
