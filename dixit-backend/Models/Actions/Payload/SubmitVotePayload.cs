using System.ComponentModel.DataAnnotations;

namespace dixit_backend.Models.Actions.Payload
{
    public class SubmitVotePayload
    {
        public string SubmitVotePayloadId { get; set; } = "";

        [Required]
        public string ImageId { get; set; } = "";
        [Required]
        public int Points { get; set; }
    }
}
