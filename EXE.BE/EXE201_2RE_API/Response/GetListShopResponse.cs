namespace EXE201_2RE_API.Response
{
    public class GetListShopResponse
    {
        public Guid shopId { get; set; }
        public string shopName { get; set; }
        public string shopLogo { get; set; }
        public int totalRating { get; set; }
        public int quantityRating { get; set; }

    }
}
