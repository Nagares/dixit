using dixit_backend.Models.Actions;
using System.ComponentModel.DataAnnotations;

namespace dixit_backend.Model
{
    public class Player
    {
        public string PlayerId { get; set; } = "";
        [Required]
        public string Name { get; set; } = "";
        public int Points { get; set; }
        public List<PlayerAction> PlayerActions { get; set; } = new List<PlayerAction>();
        public List<string> Messages { get; set; } = new List<string>();
    }
}
