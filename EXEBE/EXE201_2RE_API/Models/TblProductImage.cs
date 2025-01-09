using System.ComponentModel.DataAnnotations;

namespace EXE201_2RE_API.Models
{
    public class TblProductImage
    {
        [Key]
        public Guid productImageId { get; set; }

        public Guid? productId { get; set; }

        public string? imageUrl{ get; set; }

        public virtual TblProduct? product { get; set; }
    }
}
