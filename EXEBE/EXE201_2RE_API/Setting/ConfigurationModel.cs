namespace EXE201_2RE_API.Settings
{
    public class ConfigurationModel
    {
        public class GoogleConfiguration
        {
            public string? ClientID { get; set; }
            public string? ClientSecret { get; set; }
        }
        public class FirebaseConfiguration
        {
            public string? ApiKey { get; set; }
            public string? AuthEmail { get; set; }
            public string? AuthPassword { get; set; }
            public string? Bucket { get; set; }

        }
    }
}
