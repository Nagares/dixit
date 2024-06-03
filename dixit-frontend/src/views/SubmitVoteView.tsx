import { Box, Button, Text, VStack, Image, Input, HStack, Center } from "@chakra-ui/react"
import { Player } from "../models/Player";
import { ServerState } from "../models/Serverstate";
import { useState } from "react";
import { getApiPlayerSubmitVoteUrl } from "../utils/UrlUtils";

const blacklistedInputs = ['e', '+', '-'];

type SubmitVoteViewProps = {
    currentPlayer: Player;
    serverState: ServerState;
}

export const SubmitVoteView: React.FC<SubmitVoteViewProps> = ({ currentPlayer, serverState }: SubmitVoteViewProps) => {
    const [voteValues, setVoteValues] = useState(new Map());
    const [submitted, setSubmitted] = useState<boolean>(false);

    const playerId = currentPlayer.playerId;
    const imageSubmissions = serverState.currentImageSubmissions.filter(i => i.playerId !== currentPlayer.playerId);

    const handleOnChangeVote = (e: React.ChangeEvent<HTMLInputElement>, imageId: string): void => {
        e.preventDefault();

        let value = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null;

        if (value && value < 0) value = 0;
        if (value && value > 5) value = 5;

        setVoteValues(new Map(voteValues.set(imageId, value)));
    }

    const handleSubmitVote = (imageId: string) => {
        const value = voteValues.get(imageId);

        fetch(getApiPlayerSubmitVoteUrl(playerId), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                points: value,
                imageId: imageId
            })
        })
            .then(() => setSubmitted(true))
            .catch(() => setSubmitted(false));
    }

    return (
        <VStack spacing={5}>
            {submitted ?
                <Text>You have submitted your vote, please wait for your friend</Text>
                :
                <Box>
                    <Text>Place your vote for an Image that fit to the narrative </Text>
                    <Text mt={2}>possible value (0 - 5)</Text>
                    <Center mt={5}>
                        <HStack>
                            {
                                imageSubmissions.map(x => {
                                    return (
                                        <VStack key={x.imageId}>
                                            <Image height={"20vh"} src={x.imageBase64} />
                                            <Input width={20} type="number" size='md' placeholder='(0-5)' value={voteValues.get(x.imageId)} onKeyDown={(evt) => blacklistedInputs.includes(evt.key) && evt.preventDefault()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChangeVote(e, x.imageId)} />
                                            {voteValues.get(x.imageId) && <Button colorScheme='blue' onClick={() => handleSubmitVote(x.imageId)}>Submit vote</Button>}
                                        </VStack>
                                    )
                                })
                            }
                        </HStack>
                    </Center>
                </Box>
            }
        </VStack>
    )
}
