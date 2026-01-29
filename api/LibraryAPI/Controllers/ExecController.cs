using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using LibraryAPI.Models;
using System.Text.Json;

namespace LibraryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExecController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ExecController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> ExecuteProcedure([FromBody] ExecuteRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");
                
                using var connection = new SqlConnection(connectionString);
                using var command = new SqlCommand(request.ProcedureName, connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                foreach (var param in request.Parameters)
                {
                    var value = param.Value;
                    if (value is JsonElement jsonElement)
                    {
                        value = ConvertJsonElement(jsonElement);
                    }
                    command.Parameters.AddWithValue($"@{param.Key}", value ?? DBNull.Value);
                }

                await connection.OpenAsync();
                
                using var reader = await command.ExecuteReaderAsync();
                var results = new List<Dictionary<string, object>>();

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null! : reader.GetValue(i);
                    }
                    results.Add(row);
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private object ConvertJsonElement(JsonElement element)
        {
            return element.ValueKind switch
            {
                JsonValueKind.String => element.GetString(),
                JsonValueKind.Number => element.TryGetInt32(out var intValue) ? intValue : element.GetDouble(),
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                JsonValueKind.Null => null,
                _ => element.ToString()
            };
        }
    }
}