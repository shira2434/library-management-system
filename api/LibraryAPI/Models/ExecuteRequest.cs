using System.Text.Json;

namespace LibraryAPI.Models
{
    public class ExecuteRequest
    {
        public string ProcedureName { get; set; } = string.Empty;
        public Dictionary<string, object> Parameters { get; set; } = new();
    }
}