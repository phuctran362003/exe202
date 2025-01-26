namespace EXE201_2RE_API.Response
{
    public class AdminDashboardResponse
    {
        public int totalUsers {  get; set; }
        public int totalShops {  get; set; }
        public int totalOrdersThisMonth {  get; set; }
        public List<MonthlyRevenue> monthlyRevenue { get; set; }
        public List<Top5Shop> top5Shop { get; set; }
    }

    public class Top5Shop
    {
        public string name { get; set; }
        public double revenue { get; set; }
    }
}
