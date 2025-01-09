namespace EXE201_2RE_API.Response
{
    public class DashboardOfShopResponse
    {
        public int? totalProducts {  get; set; }

        public int? totalOrders { get; set; }

        public double? revenueThisMonth { get; set; }

        public List<MonthlyRevenue> monthlyRevenue { get; set; }

        public int? totalRatings { get; set; }

    }

    public class MonthlyRevenue
    {
        public int month { get; set; }
        public double? revenue { get; set; }
    }
}
