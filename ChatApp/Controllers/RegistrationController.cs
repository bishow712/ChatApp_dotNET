using System.Data;
using System.Data.SqlClient;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public RegistrationController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Register the user to the database
    [HttpPost]
    [Route("registration")]
    public string Registration(Registration registration)
    {
        try
        {
            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            conn.Open();      

            SqlCommand cmd = new SqlCommand("INSERT INTO dbo.UserRegistration (Name, Email, Password) VALUES (@Name, @Email, @Password)", conn);
            
            cmd.Parameters.AddWithValue("@Name", registration.Name);
            cmd.Parameters.AddWithValue("@Email", registration.Email);
            cmd.Parameters.AddWithValue("@Password", registration.Password);

            conn.Close();

            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected > 0)
            {
                return "Data Inserted.";
            }
            else
            {
                return "Error while inserting data.";
            }
        }
        catch (Exception ex)
        {
            return "Error: " + ex.Message;
        }
    }

    [HttpPost]
    [Route("login")]
    public string Login(Registration registration)
    {
        try
        {
            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            conn.Open();
            SqlDataAdapter da = new SqlDataAdapter("select * from dbo.UserRegistration where Email='"+registration.Email+"' and Password='"+registration.Password+"'",conn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            if(dt.Rows.Count>0){
                return "Data Found";
            } else {
                return "Data not Found";
            }
        }
        catch (Exception ex)
        {
           return "Error: " + ex.Message;
        }
    }

    [HttpGet]
    [Route("users")]
    public ActionResult<IEnumerable<string>> Users()
    {
        try{
            List<string> nameList = new List<string>();

            SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        
            conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT Name From UserRegistration", conn);

            SqlDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                string name = dr.GetString(dr.GetOrdinal("Name"));
                nameList.Add(name);
            }

            return Ok(nameList);        
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Exception: {ex.Message}");
        }
    }
}