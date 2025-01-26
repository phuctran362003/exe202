using System.Text.Json.Serialization;

namespace EXE201_2RE_API.DTOs
{
    public class ActionOutcome
    {
        public object? result { get; set; }
        public bool isSuccess { get; set; } = true;
        public string message { get; set; } = string.Empty;
        public string value { get; set; } = string.Empty;
    }
}
