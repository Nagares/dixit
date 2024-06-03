import { Text, VStack, Image, Button, Box, Center } from "@chakra-ui/react";
import { useState } from "react";
import { FileInput } from "../components/FileInput";
import { Player } from "../models/Player";
import { ServerState } from "../models/Serverstate";
import { getApiPlayerSubmitImageUrl } from "../utils/UrlUtils";

type SubmitImageViewProps = {
  currentPlayer: Player;
  serverState: ServerState;
}

export const SubmitImageView: React.FC<SubmitImageViewProps> = ({ currentPlayer, serverState }: SubmitImageViewProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmitImage = () => {
    fetch(getApiPlayerSubmitImageUrl(currentPlayer.playerId), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64Image: image
      })
    }).then(() => setSubmitted(true));
  }

  return (
    <VStack spacing={5}>
      {submitted ?
        <Text>You have submitted your image, please wait for your friend</Text>
        :
        <Box>
          <Text>Upload your image</Text>
          <Text mt={2}>{`Find image that fit to : ${serverState.currentText}`}</Text>
          <FileInput setImage={setImage}></FileInput>
          {image &&
            <Center>
              <Image mt={5} height={"30vh"} src={image} />
            </Center>
          }
          {image && <Button mt={2} colorScheme='blue' onClick={() => handleSubmitImage()}>Submit image</Button>}
        </Box>
      }
    </VStack>
  );
};