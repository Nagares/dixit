import { Button, Text, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Player } from "../models/Player";
import { getApiPlayersUrl } from "../utils/UrlUtils";

type JoinGameViewProps = {
    setPlayer: Function
}

export const JoinGameView: React.FC<JoinGameViewProps> = ({ setPlayer }: JoinGameViewProps) => {

    const [username, setUsername] = useState<string>("")

    // handle change event
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setUsername(e.target.value);
    };

    const handleJoinGame = () => {
        fetch(getApiPlayersUrl(), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: username
            })
        })
            .then(res => res.json())
            .then((res: Player) => {
                setPlayer(res);
            });
    }

    return (
        <VStack spacing={5} >
            <Text>Enter you username to join the game</Text>
            <Input width={350} placeholder='Username' onChange={handleChange} />
            <Button colorScheme='blue' onClick={() => handleJoinGame()}>Join game</Button>
        </VStack >
    )
};