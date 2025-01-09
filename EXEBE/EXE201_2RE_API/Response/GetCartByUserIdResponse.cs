namespace EXE201_2RE_API.Response
{
    public class GetCartByUserIdResponse
    {
        public decimal? totalPrice { get; set; }
        public string? paymentMethod { get; set; }
        public DateTime? dateTime { get; set; }
        public string? address { get; set; }
        public string? email { get; set; }
        public string? fullName { get; set; }
        public string? phone { get; set; }
        public List<GetCartDetailResponse> listProducts { get; set; }
        public string status { get; set; }
    }

    public class GetCartDetailResponse
    {
        public Guid? productId { get; set; }
        public string name { get; set; }
        public string size { get; set; }
        public string imageUrl { get; set; }
        public decimal? price { get; set; }
    }
}
