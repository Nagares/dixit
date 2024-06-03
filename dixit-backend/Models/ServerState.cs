using dixit_backend.Models;
using dixit_backend.Types;
using System.Text.Json.Serialization;

namespace dixit_backend.Model
{
    public class ServerState
    {
        public ServerState(int maxPlayers, int maxRounds) {
            MaxPlayers = maxPlayers;
            MaxRounds = maxRounds;
        }

        public List<Player> Players { get; set; } = new List<Player>();
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public GameState CurrentGameState { get; set; } = GameState.WAITING_FOR_PLAYERS;
        public int MaxPlayers { get; set; }
        public int MaxRounds { get; set; }
        public int CurrentRound { get; set; }
        public string? CurrentText { get; set; }
        public Player? CurrentPlayerToWriteText { get; set; }
        public List<ImageSubmission> CurrentImageSubmissions { get; set; } = new();
        public List<Player> CurrentVotesSubmissions { get; set; } = new();
    }
}
