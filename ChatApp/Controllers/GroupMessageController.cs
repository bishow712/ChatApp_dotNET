using ChatApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupMessageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<MessageHub> _hubContext;
        public GroupMessageController(IConfiguration configuration, IHubContext<MessageHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("createmessage")]
        public async Task<IActionResult> CreateMessage(GroupMessageModel groupMessage)
        {
            try
            {
                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO dbo.GroupMessage (Name, Message) VALUES (@Sender, @Message)", conn);

                cmd.Parameters.AddWithValue("@Sender", groupMessage.SenderName);
                cmd.Parameters.AddWithValue("@Message", groupMessage.Message);

                int rowsAffected = cmd.ExecuteNonQuery();

                conn.Close();

                if (rowsAffected > 0)
                {
                    // Notify clients about the new message
                    _hubContext.Clients.All.SendAsync("ReceiveGroupMessage", new { groupMessage.SenderName, groupMessage.Message });

                    return Ok("Message Sent.");
                }
                else
                {
                    return BadRequest("Error while sending message.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("getmessages")]
        public IActionResult FetchMessages()
        {
            try
            {
                List<Dictionary<string, object>> conversation = new List<Dictionary<string, object>>();

                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("select * from dbo.GroupMessage", conn);

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    string Sender = dr.GetString(dr.GetOrdinal("Name"));
                    string Message = dr.GetString(dr.GetOrdinal("Message"));

                    Dictionary<string, object> row = new Dictionary<string, object>
                    {
                        {"Sender", Sender},
                        {"Message", Message},
                    };

                    conversation.Add(row);
                }

                conn.Close();

                return Ok(conversation);

            }
            catch (Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}
