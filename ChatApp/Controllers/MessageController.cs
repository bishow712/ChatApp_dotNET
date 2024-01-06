using ChatApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;

namespace ChatApp.Controllers
{
    [Route("api/message")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MessageController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Send message
        [HttpPost]
        [Route("createmessage")]
        public ActionResult<object> CreateMessage([FromQuery(Name = "Sender")] string SenderMail, [FromQuery(Name = "Receiver")] string ReceiverMail, [FromQuery(Name = "Content")] string Content)
        {
            try
            {
                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO dbo.Message (SenderMail, ReceiverMail, Content) VALUES (@Sender, @Receiver, @Content)", conn);

                cmd.Parameters.AddWithValue("@Sender", SenderMail);
                cmd.Parameters.AddWithValue("@Receiver", ReceiverMail);
                cmd.Parameters.AddWithValue("@Content", Content);

                int rowsAffected = cmd.ExecuteNonQuery();

                conn.Close();

                if (rowsAffected > 0)
                {
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
        [Route("getmessages")]
        public ActionResult<object> FetchMessages([FromQuery(Name="Sender")] string SenderMail, [FromQuery(Name = "Receiver")] string ReceiverMail)
        {
            try
            {
                List<Dictionary<string, object>> conversation = new List<Dictionary<string, object>>();

                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("select * from Message where SenderMail = @Sender and ReceiverMail = @Receiver or SenderMail = @Receiver and ReceiverMail = @Sender", conn);

                cmd.Parameters.AddWithValue("@Sender", SenderMail);
                cmd.Parameters.AddWithValue("@Receiver", ReceiverMail);

                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    string Sender = dr.GetString(dr.GetOrdinal("SenderMail"));
                    string Receiver = dr.GetString(dr.GetOrdinal("ReceiverMail"));
                    string Content = dr.GetString(dr.GetOrdinal("Content"));
                    DateTime Timestamp = dr.GetDateTime(dr.GetOrdinal("Timestamp"));

                    Dictionary<string, object> row = new Dictionary<string, object>
                    {
                        {"SenderMail", Sender},
                        {"ReceiverMail", Receiver},
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
        [Route("messagereceivers")]
        public ActionResult<object> Receivers([FromQuery(Name = "Sender")] string SenderMail)
        {
            try
            {
                List<string> Receivers = new List<string>();

                SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                conn.Open();

                SqlCommand cmd = new SqlCommand("select distinct ReceiverMail from Message where SenderMail = @Sender", conn);

                cmd.Parameters.AddWithValue("@Sender", SenderMail);
          
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {               
                    string Receiver = dr.GetString(dr.GetOrdinal("ReceiverMail"));                  

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
