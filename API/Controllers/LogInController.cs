using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DTO;
using SendGrid;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LogInController : Controller
    {

        [HttpGet]
        public ApiResponse Login(string email, string password)
        {
            LogInManager logManager = new LogInManager();
            ApiResponse response = new ApiResponse();

            int result = logManager.AuthenticateUser(email, password);
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Log In exitoso";
                response.Content = email;
            }
            else if (result == -1)
            {
                response.StatusCode = "412";
                response.Message = "Correo Inexistente";
                response.Content = "";
            }
            else if (result == -2)
            {
                response.StatusCode = "413";
                response.Message = "Contraseña Incorrecta";
                response.Content = "";
            }
            else 
            {
                response.StatusCode = "500";
                response.Message = "Ni idea de que paso";
                response.Content = "";
            }

            return response;
        }

    }
}
