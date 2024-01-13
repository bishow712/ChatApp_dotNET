using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;

namespace ChatApp.Controllers
{
    [Route("api/message")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<MessageHub> _hubContext;

        public MessageController(IConfiguration configuration, IHubContext<MessageHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        // Send message
        [HttpPost]
        [Route("createmessage")]
        public async Task<IActionResult> CreateMessage([FromQuery(Name = "Sender")] int SenderId, [FromQuery(Name = "Receiver")] int ReceiverId, [FromQuery(Name = "Content")] string Content)
        {
            try
            {
                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO dbo.Message (SenderId, ReceiverId, Content) VALUES (@Sender, @Receiver, @Content)", conn);

                cmd.Parameters.AddWithValue("@Sender", SenderId);
                cmd.Parameters.AddWithValue("@Receiver", ReceiverId);
                cmd.Parameters.AddWithValue("@Content", Content);

                int rowsAffected = cmd.ExecuteNonQuery();

                conn.Close();

                if (rowsAffected > 0)
                {
                    // Notify clients about the new message
                    _hubContext.Clients.All.SendAsync("Message", new { SenderId, ReceiverId, Content });

                    return Ok("Message Sent.");
                }
                else
                {
                    return BadRequest("Error while sending message.");
                }
            }
            catch(Exception ex) 
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        // Fetch Messages
        [HttpGet]
        [Route("getmessages/{user1}/{user2}")]
        public ActionResult<object> FetchMessages(int user1, int user2)
        {
            try
            {
                List<Dictionary<string, object>> conversation = new List<Dictionary<string, object>>();

                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("select * from Message where SenderId = @user1 and ReceiverId = @user2 or SenderId = @user2 and ReceiverId = @user1", conn);

                cmd.Parameters.AddWithValue("@user1", user1);
                cmd.Parameters.AddWithValue("@user2", user2);

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    int Sender = dr.GetInt32(dr.GetOrdinal("SenderId"));
                    int Receiver = dr.GetInt32(dr.GetOrdinal("ReceiverId"));
                    string Content = dr.GetString(dr.GetOrdinal("Content"));
                    DateTime Timestamp = dr.GetDateTime(dr.GetOrdinal("Timestamp"));

                    Dictionary<string, object> row = new Dictionary<string, object>
                    {
                        {"SenderId", Sender},
                        {"ReceiverId", Receiver},
                        {"Content", Content},
                        {"Timestamp", Timestamp},
                        
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

        // Fetch Messages
        [HttpGet]
        [Route("{senderId}/messagereceivers")]
        public ActionResult<object> Receivers(int senderId)
        {
            try
            {
                List<string> Receivers = new List<string>();

                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("select distinct ReceiverId from Message where SenderId = @Sender", conn);

                cmd.Parameters.AddWithValue("@Sender", senderId);
          
                SqlDataReader dr = cmd.ExecuteReader();

                while(dr.Read())
                {               
                    string Receiver = dr.GetString(dr.GetOrdinal("ReceiverId"));                  

                    Receivers.Add(Receiver);
                }

                conn.Close();

                return Ok(Receivers);

            }
            catch (Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}
