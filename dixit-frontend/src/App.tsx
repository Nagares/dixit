import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Heading,
  Divider,
  ThemeConfig,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { PlayerList } from "./components/PlayerList"
import { Player } from "./models/Player"
import { ServerState } from "./models/Serverstate"
import { GameState } from "./types/GameState"
import { getApiServerStateUrl } from "./utils/UrlUtils"
import { JoinGameView } from "./views/JoinGameView"
import { WaitingForPlayerView } from "./views/WaitingForPlayersView"
import { SubmitImageView } from "./views/SubmitImageView"
import { SubmitTextView } from "./views/SubmitTextView"
import { ObserverView } from "./views/ObserverView"
import { SubmitVoteView } from "./views/SubmitVoteView"
import { CurrentResultView } from "./views/CurrentResultView"
import { GameoverView } from "./views/GameOverView"

export const App = () => {

  const POOLING_RATE: number = 1000;

  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [serverstate, setServerstate] = useState<ServerState | undefined>(undefined);

  // set theme configuration
  const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
  }
  theme.config = config;

  useEffect(() => {
    const interval = setInterval(() => {
      updateServerState();
    }, POOLING_RATE);
    return () => clearInterval(interval);
  }, []);

  const updateServerState = () => {
    fetch(getApiServerStateUrl(), {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then((res: ServerState) => {
        setServerstate(res);
      });
  }

  const renderViews = () => {
    let alreadyInGame = serverstate?.players.some(p => p.playerId === player?.playerId);

    // game is waiting for player and current user has not joined the game
    // condition player object is not set or player object is not in already in game
    if ((player === undefined || (player && !alreadyInGame)) && serverstate?.currentGameState === GameState.WAITING_FOR_PLAYERS) {
      return <JoinGameView setPlayer={setPlayer} />
    }

    // game is waiting for player and current user has joined the game
    if (player && alreadyInGame && serverstate?.currentGameState === GameState.WAITING_FOR_PLAYERS) {
      return <WaitingForPlayerView currentPlayer={player} />
    }

    // game is waiting for player to submit the text
    if (player && alreadyInGame && serverstate?.currentGameState === GameState.SUBMIT_TEXT) {
      return <SubmitTextView currentPlayer={player} serverState={serverstate} />
    }

    // game is waiting for player to submit the image
    if (player && alreadyInGame && serverstate?.currentGameState === GameState.SUBMIT_IMAGE) {
      return <SubmitImageView currentPlayer={player} serverState={serverstate} />
    }

    // game is waiting for player to submit the image
    if (player && alreadyInGame && serverstate?.currentGameState === GameState.SUBMIT_VOTE) {
      return <SubmitVoteView currentPlayer={player} serverState={serverstate} />
    }

    // show current result
    if (player && alreadyInGame && serverstate?.currentGameState === GameState.CURRENT_RESULT) {
      return <CurrentResultView currentPlayer={player} serverState={serverstate} />
    }

    // show game over
    if (player && alreadyInGame && serverstate?.currentGameState === GameState.GAME_OVER) {
      return <GameoverView currentPlayer={player} serverState={serverstate} />
    }

    // default view if the game is already started or full
    return <ObserverView serverState={serverstate}></ObserverView>
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />

          <Heading as='h1' size='4xl' noOfLines={1}>
            Meme War Dixit
          </Heading>

          <Divider mt={5} />

          <Box mt={20} minH={"60vh"}>
            {renderViews()}
          </Box>

          <Divider mt={5} mb={5} />

          <PlayerList currentPlayer={player} serverState={serverstate} />

        </Grid>
      </Box>
    </ChakraProvider >
  );
}
