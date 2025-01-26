using EXE201_2RE_API.Models;

namespace EXE201_2RE_API.DTOs
{
    public class ProductModel
    {
        public Guid productId { get; set; }

        public string? shopOwner { get; set; }

        public string? category { get; set; }

        public string? genderCategory { get; set; }

        public string? size { get; set; }

        public string name { get; set; }

        public decimal price { get; set; }
        public decimal sale { get; set; }

        public string imgUrl { get; set; }

        public string description { get; set; }

        public string status { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime updatedAt { get; set; }

    }
}
