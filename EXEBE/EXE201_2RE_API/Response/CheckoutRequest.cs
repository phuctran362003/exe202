namespace EXE201_2RE_API.Response
{
    public class CheckoutRequest
    {
        public Guid userId {  get; set; }
        public string email {  get; set; }
        public string fullName { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public List<Guid> products { get; set; }
        public int price { get; set; }
        public string paymentMethod { get; set; }
    }
}
