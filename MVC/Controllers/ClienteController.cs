using Microsoft.AspNetCore.Mvc;
using MVC.Models;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MVC.Controllers
{
    public class ClienteController : Controller
    {
        private readonly IConfiguration _configuration;

        public ClienteController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        public IActionResult CrearCuenta(ClienteModel cliente)
        {
            string clientId = _configuration["PaypalSettings:ClientId"];

            // Use clientId as needed
            ViewData["ClientId"] = clientId;

            return View(cliente);
        }

        public IActionResult CambiarContrasena()
        {
            return View();
        }
        public IActionResult RecuperarContrasena()
        {
            return View();
        }
        public IActionResult CitasMedicion()
        {
            return View();
        }
        public IActionResult Clases()
        {
            return View();
        }
        public IActionResult Entrenamientos()
        {
            return View();
        }
        public IActionResult EntrenamientosPersonales()
        {
            return View();
        }
        public IActionResult Rutinas()
        {
            return View();
        }
        public IActionResult Progreso()
        {
            return View();
        }
        public IActionResult VerCuenta()
        {
            return View();
        }
        public IActionResult Pago()
        {
            return View();
        }
        public IActionResult ResetPassword(string token, string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest("Token and email are required.");
            }

            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jwtToken = handler.ReadJwtToken(token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);
                if (emailClaim != null && emailClaim.Value == email)
                {
                    var model = new ResetPasswordModel { Token = token, Email = email };

                    Console.WriteLine("ResetPassword action hit with token: " + token + " and email: " + email);

                    return View(model);
                }
                return BadRequest("Invalid token or email.");
            }
            catch
            {
                return BadRequest("Invalid token.");
            }
        }
    }
}
