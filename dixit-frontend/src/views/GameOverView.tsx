import { Box, Button, Text, VStack } from "@chakra-ui/react"
import { getApiRestartUrl } from "../utils/UrlUtils";
import { Player } from "../models/Player";
import { ServerState } from "../models/Serverstate";

type GameoverViewProps = {
    currentPlayer: Player;
    serverState: ServerState;
}

export const GameoverView: React.FC<GameoverViewProps> = ({ currentPlayer, serverState }: GameoverViewProps) => {
    const handleRestart = () => {
        fetch(getApiRestartUrl(currentPlayer.playerId), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return (
        <Box>
            <Text>Game over</Text>
            <Text>{`Total rounds : ${serverState.currentRound}`}</Text>
            <VStack mt={5}>
                {serverState?.players.map(p => {
                    return (
                        <Box key={p.playerId}>
                            <Text>{`Player: ${p.name} (points: ${p.points})`}</Text>
                        </Box>
                    )
                })}
            </VStack>
            <Button mt={10} colorScheme='blue' onClick={() => handleRestart()}>Restart</Button>
        </Box>
    )
}
