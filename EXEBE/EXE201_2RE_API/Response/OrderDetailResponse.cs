namespace EXE201_2RE_API.Response
{
    public class OrderDetailResponse
    {
        public Guid productId { get; set; }
        public string productName { get; set; }
        public decimal price { get; set; }
        public string imageUrl { get; set; }
        public string shopName { get; set; }
    }
}
