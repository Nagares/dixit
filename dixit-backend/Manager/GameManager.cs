using dixit_backend.Model;
using dixit_backend.Models;
using dixit_backend.Models.Actions;
using dixit_backend.Models.Actions.Payload;
using dixit_backend.Types;
using System.Numerics;

namespace dixit_backend.Manager
{
    public class GameManager
    {
        // thread safe - singleton setup
        private static GameManager? instance;
        private static readonly object singletonlock = new();

        // const
        private const int MAX_PLAYERS = 3;
        private const int MAX_ROUNDS = 4;

        // The server state object, stores all game data
        private ServerState Serverstate { get; set; } = new ServerState(MAX_PLAYERS, MAX_ROUNDS);

        public static GameManager GetInstance()
        {
            lock (singletonlock)
            {
                if (instance == default(GameManager))
                {
                    instance = new GameManager();
                }

                return instance;
            }
        }

        public static ServerState GetServerState()
        {
            return GetInstance().Serverstate;
        }

        public static Player PlayerJoin(Player player)
        {
            if (GetInstance().Serverstate.CurrentGameState != GameState.WAITING_FOR_PLAYERS)
            {
                throw new Exception($"You cant login at this state, current gamestate:{GetInstance().Serverstate.CurrentGameState}");
            }

            if (GetInstance().Serverstate.Players.Count <= MAX_PLAYERS)
            {
                // add new player, generate id and clear actions, messages
                player.PlayerId = Guid.NewGuid().ToString();
                player.PlayerActions.Clear();
                player.Messages.Clear();

                // add JoinAction
                player.PlayerActions.Add(new PlayerAction() { Type = PlayerActionType.JOIN });

                // add player to pool
                GetInstance().Serverstate.Players.Add(player);

                // check state change
                if (GetInstance().Serverstate.Players.Count < MAX_PLAYERS)
                {
                    GetInstance().Serverstate.CurrentGameState = GameState.WAITING_FOR_PLAYERS;
                }
                else if (GetInstance().Serverstate.Players.Count == MAX_PLAYERS)
                {
                    GetInstance().Serverstate.CurrentGameState = GameState.SUBMIT_TEXT;
                    GetInstance().Serverstate.CurrentPlayerToWriteText = GetInstance().Serverstate.Players[GetInstance().Serverstate.CurrentRound];
                    GetInstance().Serverstate.CurrentRound += 1;
                }

                return player;
            }

            throw new Exception("Too many players");
        }

        public static SubmitTextPayload PlayerActionSubmitText(string playerId, SubmitTextPayload payload)
        {
            if (GetInstance().Serverstate.CurrentGameState != GameState.SUBMIT_TEXT)
            {
                throw new Exception($"You cant submit text at this state, current gamestate:{GetInstance().Serverstate.CurrentGameState}");
            }

            if (GetInstance().Serverstate.CurrentPlayerToWriteText != null && GetInstance().Serverstate.CurrentPlayerToWriteText!.PlayerId.Equals(playerId))
            {
                GetInstance().Serverstate.CurrentText = payload.text;
                GetInstance().Serverstate.CurrentGameState = GameState.SUBMIT_IMAGE;
                GetInstance().Serverstate.CurrentPlayerToWriteText!.PlayerActions.Add(new PlayerAction() { Type = PlayerActionType.SUBMIT_TEXT });

                payload.SubmitTextPayloadId = Guid.NewGuid().ToString();
                return payload;

            }

            throw new Exception($"You cant submit text its not your turn, current gamestate:{GetInstance().Serverstate.CurrentGameState}");
        }

        public static SubmitImagePayload PlayerActionSubmitImage(string playerId, SubmitImagePayload payload)
        {
            if (GetInstance().Serverstate.CurrentGameState != GameState.SUBMIT_IMAGE)
            {
                throw new Exception($"You cant submit image at this state, current gamestate:{GetInstance().Serverstate.CurrentGameState}");
            }

            // check already submitted
            var alreadyExist = GetInstance().Serverstate.CurrentImageSubmissions.FirstOrDefault(i => i.PlayerId == playerId);
            if (alreadyExist != null)
            {
                throw new Exception($"You already submitted image for this round");
            }

            var playerSubmitImage = GetInstance().Serverstate.Players.FirstOrDefault(player => player.PlayerId.Equals(playerId));
            if (playerSubmitImage == null)
            {
                throw new Exception($"Failed to submit image, there is no player with id:{playerId} in the player list");
            }
            playerSubmitImage.PlayerActions.Add(new PlayerAction() { Type = PlayerActionType.SUBMIT_IMAGE });

            // just for tracking later on
            var id = Guid.NewGuid().ToString();

            // add to the list
            GetInstance().Serverstate.CurrentImageSubmissions.Add(new ImageSubmission() { ImageId = id, PlayerId = playerId, ImageBase64 = payload.base64Image });

            if (GetInstance().Serverstate.CurrentImageSubmissions.Count == MAX_PLAYERS)
            {
                GetInstance().Serverstate.CurrentGameState = GameState.SUBMIT_VOTE;
            }

            payload.SubmitImagePayloadId = id;
            return payload;
        }

        public static object PlayerActionSubmitVote(string playerId, SubmitVotePayload payload)
        {
            if (GetInstance().Serverstate.CurrentGameState != GameState.SUBMIT_VOTE)
            {
                throw new Exception($"You cant submit vote at this state, current gamestate:{GetInstance().Serverstate.CurrentGameState}");
            }

            // check if player already submitted vote
            var alreadySubmittedVote = GetInstance().Serverstate.CurrentVotesSubmissions.FirstOrDefault(player => player.PlayerId.Equals(playerId));
            if (alreadySubmittedVote != null)
            {
                throw new Exception($"You already submitted vote for this round");
            }

            var playerVoting = GetInstance().Serverstate.Players.FirstOrDefault(player => player.PlayerId.Equals(playerId));
            if (playerVoting == null)
            {
                throw new Exception($"Failed to vote, there is no player with id:{playerId} in the player list");
            }

            // find image from image submission list
            var imageSubmission = GetInstance().Serverstate.CurrentImageSubmissions.FirstOrDefault(image => image.ImageId.Equals(payload.ImageId));
            if (imageSubmission == null) throw new Exception($"Cant find image with id:{payload.ImageId}");

            // find player that submitted the image
            var playerGotVoted = GetInstance().Serverstate.Players.FirstOrDefault(player => player.PlayerId.Equals(imageSubmission.PlayerId));
            if (playerGotVoted == null) throw new Exception($"There is no image submission from playerId:{playerId} or player is not registered in player list");

            // update image points and player total points
            imageSubmission.Points = payload.Points;
            playerGotVoted.Points += payload.Points;
            playerGotVoted.PlayerActions.Add(new PlayerAction() { Type = PlayerActionType.SUBMIT_VOTE });

            // just for tracking later on
            var id = Guid.NewGuid().ToString();
            payload.SubmitVotePayloadId = id;

            GetInstance().Serverstate.CurrentVotesSubmissions.Add(playerVoting);

            // check if everyone has submitted the vote 
            if (GetInstance().Serverstate.CurrentVotesSubmissions.Count == MAX_PLAYERS)
            {
                // check if the current round is not the last round
                if (GetInstance().Serverstate.CurrentRound < MAX_ROUNDS)
                {
                    GetInstance().Serverstate.CurrentGameState = GameState.CURRENT_RESULT;
                }
                else if (GetInstance().Serverstate.CurrentRound == MAX_ROUNDS)
                {
                    GetInstance().Serverstate.CurrentGameState = GameState.GAME_OVER;
                }
            }

            return payload;
        }

        public static void PlayerActionNextRound(string playerId)
        {
            if (GetInstance().Serverstate !=null && GetInstance().Serverstate.CurrentGameState == GameState.CURRENT_RESULT && GetInstance().Serverstate.CurrentRound < MAX_ROUNDS)
            {
                var player = GetInstance().Serverstate.Players.FirstOrDefault(p => p.PlayerId.Equals(playerId));

                if (player == null) throw new Exception($"You cant start next round because you are not in game");

                // set back the player index to the first player if we reach the end of the player list
                var playerIndex = GetInstance().Serverstate.CurrentRound;
                if (playerIndex > MAX_PLAYERS - 1) playerIndex = 0;

                // set next player to write the text
                var playerToWriteText = GetInstance().Serverstate.Players[playerIndex];

                GetInstance().Serverstate.CurrentRound += 1;
                GetInstance().Serverstate.CurrentText = "";
                GetInstance().Serverstate.CurrentImageSubmissions = new();
                GetInstance().Serverstate.CurrentPlayerToWriteText = playerToWriteText;
                GetInstance().Serverstate.CurrentVotesSubmissions = new();
                GetInstance().Serverstate.CurrentGameState = GameState.SUBMIT_TEXT;
                player.PlayerActions.Add(new PlayerAction() { Type = PlayerActionType.NEXT_ROUND });
            }

            throw new Exception($"You cant start next round at this state, current gamestate:{GetInstance().Serverstate.CurrentGameState} current round:{GetInstance().Serverstate.CurrentRound}");
        }

        public static void Restart()
        {
            GetInstance().Serverstate = new ServerState(MAX_PLAYERS, MAX_ROUNDS);
        }
    }
}
