using dixit_backend.Types;
using System.Text.Json.Serialization;

namespace dixit_backend.Models.Actions
{
    public class PlayerAction
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PlayerActionType? Type { get; set; }
    }
}
