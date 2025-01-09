namespace EXE201_2RE_API.Response
{
    public class GetListProductResponse
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
        public string brand { get; set; }
        public string condition { get; set; }

        public string status { get; set; }
    }
}
