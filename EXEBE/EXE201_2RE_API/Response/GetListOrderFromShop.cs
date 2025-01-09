namespace EXE201_2RE_API.Response
{
    public class GetListOrderFromShop
    {
        public class CartShopModel
        {
            public Guid id { get; set; }
            public int totalQuantity { get; set; }
            public decimal totalPrice { get; set; }
            public string nameUser { get; set; }
            public string code { get; set; }
            public DateTime date {  get; set; }
            public string paymentMethod { get; set; }
            public string status {  get; set; }
        }
    }
}
