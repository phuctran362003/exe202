using System.ComponentModel.DataAnnotations;

namespace EXE201_2RE_API.Models
{
    public partial class TblFavorite
    {
        [Key]
        public Guid? favoriteId { get; set; }

        [Required]
        public Guid? userId { get; set; }

        [Required]
        public Guid? productId { get; set; }

        public virtual TblUser? user { get; set; }

        public virtual TblProduct? product { get; set; }
    }
}
