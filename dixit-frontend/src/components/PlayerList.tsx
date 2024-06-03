import { Box, Container, HStack, Text } from "@chakra-ui/react"
import { CheckCircleIcon } from '@chakra-ui/icons'
import { Player } from "../models/Player";
import { ServerState } from "../models/Serverstate";

type PlayerListProps = {
    serverState?: ServerState;
    currentPlayer?: Player;
}

export const PlayerList: React.FC<PlayerListProps> = ({ currentPlayer, serverState }: PlayerListProps) => {
    return (
        <Container>
            <Text>{serverState && `Players online (${serverState?.players?.length}/${serverState?.maxPlayers})`}</Text>
            <HStack spacing='24px'>
                {serverState?.players?.map((p) => (
                    <Box key={p.playerId} border={currentPlayer?.playerId === p.playerId ? "1px" : ""} borderColor='green.200' padding={1}>
                        <CheckCircleIcon color='green.500' />
                        <Text>
                            {p.name}
                        </Text>
                    </Box>
                ))}
            </HStack>
        </Container >
    )
}