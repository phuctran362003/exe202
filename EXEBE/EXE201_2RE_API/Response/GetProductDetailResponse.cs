namespace EXE201_2RE_API.Response
{
    public class GetProductDetailResponse
    {
        public Guid productId { get; set; }
        public Guid shopId { get; set; }

        public string? shopOwner { get; set; }

        public Guid categoryId { get; set; }
        public string? category { get; set; }

        public Guid genderCategoryId { get; set; }
        public string? genderCategory { get; set; }

        public Guid sizeId { get; set; }
        public string? size { get; set; }

        public string name { get; set; }

        public decimal price { get; set; }
        public decimal sale { get; set; }

        public string mainImgUrl { get; set; }

        public List<string> listImgUrl { get; set; }

        public string description { get; set; }
        public string brand { get; set; }
        public string condition { get; set; }

        public string status { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime updatedAt { get; set; }
    }
}
