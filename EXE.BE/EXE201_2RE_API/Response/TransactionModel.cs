namespace EXE201_2RE_API.Response
{
    public class TransactionModel
    {
        public Guid transactionId { get; set; }
        public string shopBankId { get; set; }
        public string shopBank { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public double totalMoney { get; set; }
        public string status { get; set; }
    }
}
