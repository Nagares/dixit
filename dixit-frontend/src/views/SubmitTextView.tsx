import { Text, VStack, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Player } from "../models/Player";
import { ServerState } from "../models/Serverstate";
import { getApiPlayerSubmitTextUrl } from "../utils/UrlUtils";

type SubmitTextViewProps = {
  currentPlayer: Player;
  serverState: ServerState;
}

export const SubmitTextView: React.FC<SubmitTextViewProps> = ({ currentPlayer, serverState }: SubmitTextViewProps) => {
  const [text, setText] = useState<string | undefined>(undefined);

  // handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleSubmitText = () => {
    fetch(getApiPlayerSubmitTextUrl(currentPlayer.playerId), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text
      })
    })
  }

  return (
    <>
      {currentPlayer.playerId === serverState.currentPlayerToWriteText.playerId ?
        (
          <VStack spacing={5}>
            <Text>{`Write your text for round ${serverState.currentRound}`}</Text>
            <Input variant='outline' placeholder='Outline' onChange={handleChange} />
            {text && <Button colorScheme='blue' onClick={() => handleSubmitText()}>Submit text</Button>}
          </VStack>
        ) : (
          <VStack spacing={5}>
            <Text>{`Please wait while ${serverState.currentPlayerToWriteText.name} is writing the story`}</Text>
          </VStack>
        )
      }
    </>
  );
};