using System.ComponentModel.DataAnnotations;

namespace dixit_backend.Models
{
    public class ImageSubmission
    {
        [Required]
        public string PlayerId { get; set; } = "";
        [Required]
        public string ImageBase64 { get; set; } = "";
        [Required]
        public string ImageId { get; set; } = "";
        public int Points { get; set; } = 0;
    }
}
