using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public UserController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Register the user to the database
    [HttpPost]
    [Route("registration")]
    //public ActionResult<object> Registration([FromQuery(Name = "UserName")] string name, [FromQuery(Name = "Email"), DataType(DataType.EmailAddress)] string email,
    //    [FromQuery(Name = "Password"), DataType(DataType.Password)] string password)
    public IActionResult Registration(RegistrationModel registration)
    {
        try
        {

            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            conn.Open();

            SqlCommand cmd = new SqlCommand("INSERT INTO dbo.UserRegistration (Name, Email, Password) VALUES (@Name, @Email, @Password)", conn);

            cmd.Parameters.AddWithValue("@Name", registration.Name);
            cmd.Parameters.AddWithValue("@Email", registration.Email);
            cmd.Parameters.AddWithValue("@Password", registration.Password);

            // conn.Close();

            int rowsAffected = cmd.ExecuteNonQuery();

            conn.Close();

            if (rowsAffected > 0)
            {
                return Ok("User Registered.");
            }
            else
            {
                return BadRequest("Error while registering user.");
            }
        }
        catch (Exception ex)
        {
            return BadRequest("Error: " + ex.Message);
        }
    }

    // Login using email and password
    [HttpPost]
    [Route("login/{email}/{password}")]
    public ActionResult<object> Login([FromRoute(Name = "email"), DataType(DataType.EmailAddress)] string email,
        [FromRoute(Name = "password"), DataType(DataType.Password)] string password)
    {
        try
        {
            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            // conn.Open();
            SqlDataAdapter da = new SqlDataAdapter("select * from dbo.UserRegistration where Email='" + email + "' and Password='" + password + "'", conn);

            DataTable dt = new DataTable();

            da.Fill(dt);

            // Create a collection to hold objects
            List<object> resultList = new List<object>();

            if (dt.Rows.Count > 0) {
                // return "Data Found";
                foreach (DataRow row in dt.Rows)
                {
                    var userObject = new
                    {
                        Id = row["Id"],
                        Name = row["Name"],
                        Email = row["Email"],
                        Password = row["Password"]
                    };

                    resultList.Add(userObject);
                }
                return resultList;
            } else {
                return BadRequest("Data not Found");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Exception: {ex.Message}");
        }
    }

    // Get all the users info
    [HttpGet("users")]
    public ActionResult<List<string>> Users()
    {
        try
        {
            List<Dictionary<string, object>> nameList = new List<Dictionary<string, object>>();

            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT Id, Name, Email From UserRegistration", conn);

            SqlDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                int Id = dr.GetInt32(dr.GetOrdinal("Id"));
                string name = dr.GetString(dr.GetOrdinal("Name"));
                string email = dr.GetString(dr.GetOrdinal("Email"));


                Dictionary<string, object> user = new Dictionary<string, object>
                {
                    {"UserID", Id},
                    {"UserName", name},
                    {"Email", email }
                };

                nameList.Add(user);
                // nameList.Add(dr["Name"].ToString());
            }

            return Ok(nameList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Exception: {ex.Message}");
        }
    }

    // Get the user info by Id
    [HttpGet("{userId}")]
    public IActionResult UserById(int userId)
    {
        try
        {
            List<Dictionary<string, object>> nameList = new List<Dictionary<string, object>>();

            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT Id, Name, Email From UserRegistration where Id = @userId", conn);
            
            cmd.Parameters.AddWithValue("@userId", userId);

            SqlDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                int Id = dr.GetInt32(dr.GetOrdinal("Id"));
                string name = dr.GetString(dr.GetOrdinal("Name"));
                string email = dr.GetString(dr.GetOrdinal("Email"));


                Dictionary<string, object> user = new Dictionary<string, object>
                {
                    {"UserID", Id},
                    {"UserName", name},
                    {"Email", email }
                };

                nameList.Add(user);
                // nameList.Add(dr["Name"].ToString());
            }

            return Ok(nameList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Exception: {ex.Message}");
        }
    }

    // Update the user info
    [HttpPut]
    [Route("update")]
    public ActionResult<object> Update(UserModel user)
    {
        try
        {
            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            conn.Open();      

            SqlCommand cmd = new SqlCommand("Update dbo.UserRegistration set Name=@Name, Email=@Email, Password=@Password where Id=@Id", conn);
            
            cmd.Parameters.AddWithValue("@Name", user.Name);
            cmd.Parameters.AddWithValue("@Email", user.Email);
            cmd.Parameters.AddWithValue("@Password", user.Password);
            cmd.Parameters.AddWithValue("@Id", user.Id);

            // conn.Close();

            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected > 0)
            {
                return Ok("Data Updated.");
            }
            else
            {
                return BadRequest("Error while updating data.");
            }
        }
        catch(Exception ex)
        {
            return BadRequest("Exception: " + ex.Message);
        }
    }

    //Delete the user
    [HttpDelete("delete/{userId}")]
    public ActionResult<object> Delete(int UserId) 
    {
        try
        {
            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            conn.Open();

            SqlCommand cmdForUser = new SqlCommand("delete from UserRegistration where Id = @UserId", conn);
            SqlCommand cmdForMessage = new SqlCommand("delete from Message where SenderId = @UserId or ReceiverId = @UserId", conn);

            cmdForUser.Parameters.AddWithValue("@UserId", UserId);
            cmdForMessage.Parameters.AddWithValue("@UserId", UserId);

            // conn.Close();

            int rowsAffectedInUser = cmdForUser.ExecuteNonQuery();
            int rowsAffectedInMessage = cmdForMessage.ExecuteNonQuery();

            conn.Close();

            if (rowsAffectedInUser > 0 || rowsAffectedInMessage > 0)
            {
                return Ok("User Deleted.");
            }
            else
            {
                return BadRequest("Error while deleting the user.");
            }
        }
        catch (Exception ex)
        {
            return BadRequest("Exception: " + ex.Message);
        }
    }
}