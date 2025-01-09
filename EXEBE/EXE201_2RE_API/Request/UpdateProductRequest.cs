namespace EXE201_2RE_API.Request
{
    public class UpdateProductRequest
    {
        public Guid? categoryId { get; set; }

        public Guid? genderCategoryId { get; set; }

        public Guid? sizeId { get; set; }

        public string? name { get; set; }

        public decimal? price { get; set; }
        public decimal? sale { get; set; }

        public List<string>? oldImg { get; set; }
        public List<IFormFile>? listImgUrl { get; set; }

        public string? description { get; set; }
        public string? brand { get; set; }
        public string? condition { get; set; }
    }
}
