import { Box, Text } from "@chakra-ui/react"
import { ServerState } from "../models/Serverstate";

type ObserverViewProps = {
    serverState?: ServerState;
}

export const ObserverView: React.FC<ObserverViewProps> = ({ serverState }: ObserverViewProps) => {

    return (
        <Box>
            {
                serverState ?
                    <Text> The game is full</Text>
                    :
                    <Text>Waiting for server response</Text>
            }
        </Box>
    )
}
