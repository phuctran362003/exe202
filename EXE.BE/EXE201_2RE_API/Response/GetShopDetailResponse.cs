using EXE201_2RE_API.Models;

namespace EXE201_2RE_API.Response
{
    public class GetShopDetailResponse
    {
        public string userName {  get; set; }
        public string email {  get; set; }
        public string phoneNumber {  get; set; }
        public string address {  get; set; }
        public string shopName {  get; set; }
        public string shopLogo { get; set; }
        public string shopDescription { get; set; }
        public string shopAddress { get; set; }
        public string shopPhone { get; set; }
        public string shopBankId { get; set; }
        public string shopBank { get; set; }
        public int totalRating { get; set; }
        public int quantityRating { get; set; }
        public List<ReviewsList> reviews { get; set; }
    }

    public class ReviewsList
    {
        public Guid reviewId { get; set; }

        public Guid? userId { get; set; }

        public string? userName { get; set; }

        public Guid? shopId { get; set; }

        public int? rating { get; set; }

        public string? comment { get; set; }

        public DateTime? createdAt { get; set; }
    }
}
