namespace EXE201_2RE_API.Request
{
    public class ReviewRequest
    {
        public Guid? userId { get; set; }

        public Guid? shopId { get; set; }

        public int? rating { get; set; }

        public string? comment { get; set; }
    }
}
